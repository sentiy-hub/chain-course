"use client"

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { CourseMarket__factory } from '@/abis/types';
import { Contract, providers } from 'ethers';
import { YiDengToken__factory } from '@/abis/types';
import CourseMarketAbi from '@/abis/CourseMarket.json';

// 定义课程数据接口
interface Course {
  id: string;
  name: string;
  price: string;
}

// 课程合约响应接口
interface CourseResponse {
  web2CourseId: string;
  name: string;
  price: bigint;
  isActive: boolean;
  creator: string;
}

// 课程状态接口
interface CourseStatus {
  exists: boolean;
  purchased: boolean;
}

// 课程购买状态映射接口
interface CoursePurchaseStatusMap {
  [key: string]: CourseStatus;
}

// 课程显示状态接口
interface CourseDisplayStatus {
  label: string;
  className: string;
  buttonText: string;
  buttonDisabled: boolean;
}

// 组件属性接口
interface CourseCardProps {
  provider: providers.Web3Provider | undefined;
  yiDengContract: ReturnType<typeof YiDengToken__factory.connect> | null;
}

// 测试用课程数据
const testCourses: Course[] = [
  { id: '1', name: '区块链基础入门', price: '1' },
  { id: '2', name: '智能合约开发进阶', price: '2' },
  { id: '3', name: 'DApp 全栈开发', price: '3' },
];

const CourseCard: React.FC<CourseCardProps> = ({ provider, yiDengContract }) => {
  const [courseContract, setCourseContract] = useState<Contract | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursePurchaseStatus, setCoursePurchaseStatus] = useState<CoursePurchaseStatusMap>({});
  const [userAddress, setUserAddress] = useState<string>('');
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // 检查所有课程状态
  const checkAllCoursesStatus = async (): Promise<void> => {
    if (!courseContract || !userAddress) return;

    try {
      const statusPromises = testCourses.map(async (course) => {
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
    const initContract = async (): Promise<void> => {
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

  useEffect(() => {
    checkAllCoursesStatus();
  }, [courseContract, userAddress]);

  // 添加课程处理函数
  const handleAddCourse = async (course: Course): Promise<void> => {
    if (!courseContract || !isOwner) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const price = parseInt(course.price);
      const tx = await courseContract.addCourse(course.id, course.name, price);
      await tx.wait();

      await checkAllCoursesStatus();

      setSuccess(`课程 ${course.name} 添加成功！`);
    } catch (err: any) {
      setError(err.message || '上架课程失败');
    } finally {
      setLoading(false);
    }
  };

  // 购买课程处理函数
  const handlePurchaseCourse = async (web2CourseId: string): Promise<void> => {
    if (!courseContract || !yiDengContract) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const courseId = await courseContract.web2ToCourseId(web2CourseId);
      console.log('Course ID:', courseId.toString());

      if (courseId.toString() === '0') {
        throw new Error('课程不存在');
      }

      const course: CourseResponse = await courseContract.courses(courseId);

      if (!course.isActive) {
        throw new Error('课程未激活');
      }

      const balance = await yiDengContract.balanceOf(userAddress);
      const coursePrice = course.price.toString();
      const userBalance = balance.toString();

      if (parseInt(userBalance) < parseInt(coursePrice)) {
        throw new Error(`余额不足，需要 ${coursePrice} YD，当前余额 ${userBalance} YD`);
      }

      const allowance = await yiDengContract.allowance(userAddress, courseContract.address);

      if (allowance.lt(course.price)) {
        const approveTx = await yiDengContract.approve(courseContract.address, course.price);
        await approveTx.wait();
      }

      const tx = await courseContract.purchaseCourse(web2CourseId);
      await tx.wait();

      await checkAllCoursesStatus();

      setSuccess(`课程 ${course.name} 购买成功！`);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || '购买失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取课程显示状态
  const getCourseStatus = (course: Course): CourseDisplayStatus => {
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
                        sx={{
                          '&.Mui-disabled': {
                            backgroundColor: 'rgba(25, 118, 210, 0.5)',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }
                        }}
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