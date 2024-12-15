"use client"

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { CourseMarket__factory } from '@/abis/types';
import CourseMarketAbi from '@/abis/CourseMarket.json';

// TODO 测试用课程数据 当做是获取到的课程列表 - 价格单位是 YD，不需要 wei 转换
const testCourses = [
  { id: 'y01111', name: '区块链基础入门', price: '1' },
  { id: 'y03333', name: '智能合约开发进阶', price: '2' },
  { id: 'x344444', name: 'DApp 全栈开发', price: '3' },
];

const CourseCard = ({ provider, yiDengContract }) => {
  console.count();

  const [courseContract, setCourseContract] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursePurchaseStatus, setCoursePurchaseStatus] = useState({});
  const [userAddress, setUserAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 检查所有课程状态
  const checkAllCoursesStatus = async () => {
    if (!courseContract || !userAddress) return;

    try {
      const statusPromises = testCourses.map(async course => {
        try {
          const courseId = await courseContract.web2ToCourseId(course.id);
          if (courseId.toString() === '0') {
            return { [course.id]: { exists: false, purchased: false } };
          }
          const status = await courseContract.hasCourse(userAddress, course.id);
          return { [course.id]: { exists: true, purchased: status } };
        } catch (err) {
          return { [course.id]: { exists: false, purchased: false } };
        }
      });

      const statuses = await Promise.all(statusPromises);
      const statusObject = statuses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setCoursePurchaseStatus(statusObject);
    } catch (err) {
      console.error('检查课程状态失败:', err);
    }
  };

  // 初始化合约和检查课程状态
  useEffect(() => {
    const initContract = async () => {
      if (!provider) return;
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        const contractAddress = CourseMarketAbi.networks['5777'].address;
        const contract = CourseMarket__factory.connect(contractAddress, signer);
        setCourseContract(contract);

        // 检查是否是合约拥有者
        const ownerAddress = await contract.owner();
        setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());

        // 设置测试课程
        setCourses(testCourses);
      } catch (err) {
        console.error('课程合约初始化失败:', err);
        setError('课程合约初始化失败');
      }
    };

    initContract();
  }, [provider]);

  // 当合约或用户地址变化时检查课程状态
  useEffect(() => {
    checkAllCoursesStatus();
  }, [courseContract, userAddress]);

  const handleAddCourse = async course => {
    if (!courseContract || !isOwner) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // 因为代币 decimals 是 0，所以价格不需要转换
      // 上架课程时使用普通数字，不需要转换为 wei
      const price = parseInt(course.price);
      const tx = await courseContract.addCourse(course.id, course.name, price);
      await tx.wait();

      // 刷新所有课程状态
      await checkAllCoursesStatus();

      setSuccess(`课程 ${course.name} 添加成功！`);
    } catch (err) {
      setError(err.message || '上架课程失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCourse = async web2CourseId => {
    if (!courseContract || !yiDengContract) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // const signer = await provider?.getSigner();
      // const userAddress = await signer.getAddress();

      // 1. 获取课程信息
      const courseId = await courseContract.web2ToCourseId(web2CourseId);
      console.log('Course ID:', courseId.toString());

      if (courseId.toString() === '0') {
        throw new Error('课程不存在');
      }

      // 2. 获取课程详情
      const course = await courseContract.courses(courseId);
      console.log('Course details:', {
        web2CourseId: course.web2CourseId,
        name: course.name,
        price: course.price.toString(),
        isActive: course.isActive,
        creator: course.creator,
      });

      if (!course.isActive) {
        throw new Error('课程未激活');
      }

      // 3. 检查用户余额
      const balance = await yiDengContract.balanceOf(userAddress);
      console.log('User balance:', balance.toString());
      console.log('Course price:', course.price.toString());

      // 转换价格为数字进行比较
      const coursePrice = course.price.toString();
      const userBalance = balance.toString();
      console.log('Price comparison:', {
        coursePrice,
        userBalance,
      });

      if (parseInt(userBalance) < parseInt(coursePrice)) {
        throw new Error(`余额不足，需要 ${coursePrice} YD，当前余额 ${userBalance} YD`);
      }

      // 4. 检查当前授权额度
      const allowance = await yiDengContract.allowance(userAddress, courseContract.address);
      console.log('Current allowance:', allowance.toString());

      // 5. 如果授权额度不足，进行授权
      if (allowance.lt(course.price)) {
        console.log('Approving tokens...');
        const approveTx = await yiDengContract.approve(courseContract.address, course.price);
        await approveTx.wait();
        console.log('Approval successful');
      }

      // 6. 再次检查授权额度
      const newAllowance = await yiDengContract.allowance(userAddress, courseContract.address);
      console.log('New allowance after approval:', newAllowance.toString());

      // 7. 执行购买
      console.log('Executing purchase...');
      const tx = await courseContract.purchaseCourse(web2CourseId);
      console.log('Purchase transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Purchase successful:', receipt);

      // 8. 更新状态
      await checkAllCoursesStatus();

      setSuccess(`课程 ${course.name} 购买成功！`);
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err.message || '购买失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取课程显示状态
  const getCourseStatus = course => {
    const status = coursePurchaseStatus[course.id];
    if (!status?.exists) {
      return {
        label: '未上架',
        className: 'bg-gray-900/20 text-gray-400 border-gray-800/50',
        buttonText: '未上架',
        buttonDisabled: true,
      };
    }
    if (status.purchased) {
      return {
        label: '已购买',
        className: 'bg-green-900/20 text-green-400 border-green-800/50',
        buttonText: '已拥有',
        buttonDisabled: true,
      };
    }
    return {
      label: '待购买',
      className: 'bg-yellow-900/20 text-yellow-400 border-yellow-800/50',
      buttonText: '购买课程',
      buttonDisabled: false,
    };
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-gradient-to-b from-blue-800 to-blue-900 p-1 rounded-lg shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-px rounded-lg">
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">课程市场</h2>

            <div className="space-y-4">
              {courses.map(course => {
                const courseStatus = getCourseStatus(course);
                return (
                  <div
                    key={course.id}
                    className="p-4 bg-slate-800/50 rounded-lg border-2 border-blue-900/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-blue-300">{course.name}</h3>
                      <span
                        className={`px-2 py-1 text-sm rounded-full border ${courseStatus.className}`}
                      >
                        {courseStatus.label}
                      </span>
                    </div>
                    <p className="text-blue-400">价格: {course.price} YD</p>
                    <div className="mt-2 space-x-2">
                      {isOwner && !coursePurchaseStatus[course.id]?.exists && (
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => handleAddCourse(course)}
                          disabled={loading}
                        >
                          上架课程
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePurchaseCourse(course.id)}
                        disabled={loading || courseStatus.buttonDisabled}
                      >
                        {courseStatus.buttonText}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="mt-4 bg-red-900/20 text-red-400 p-3 rounded-md border border-red-800/50">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 bg-green-900/20 text-green-400 p-3 rounded-md border border-green-800/50">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
