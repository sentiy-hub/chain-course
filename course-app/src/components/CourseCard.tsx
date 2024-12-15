"use client"

import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { CourseMarket__factory } from '@/abis/types';
import { Contract, providers } from 'ethers';
import { YiDengToken__factory } from '@/abis/types';
import { v4 as uuidv4 } from 'uuid';
import CourseMarketAbi from '@/abis/CourseMarket.json';

interface Course {
  id: string;
  name: string;
  price: string;
}

interface CourseResponse {
  web2CourseId: string;
  name: string;
  price: bigint;
  isActive: boolean;
  creator: string;
}

interface CourseStatus {
  exists: boolean;
  purchased: boolean;
}

interface CoursePurchaseStatusMap {
  [key: string]: CourseStatus;
}

interface CourseDisplayStatus {
  label: string;
  className: string;
  buttonText: string;
  buttonDisabled: boolean;
}

interface CourseCardProps {
  provider: providers.Web3Provider | undefined;
  yiDengContract: ReturnType<typeof YiDengToken__factory.connect> | null;
}

interface NewCourse {
  id: string;
  name: string;
  price: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ provider, yiDengContract }) => {
  const [courseContract, setCourseContract] = useState<Contract | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursePurchaseStatus, setCoursePurchaseStatus] = useState<CoursePurchaseStatusMap>({});
  const [userAddress, setUserAddress] = useState<string>('');
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // 新增状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<NewCourse>({
    id: '',
    name: '',
    price: ''
  });

  // 从合约获取课程列表
  const fetchCourses = async () => {
    if (!courseContract) return;
    
    try {
      const courseCount = await courseContract.courseCount();
      const coursesArray: Course[] = [];
      
      for (let i = 1; i <= courseCount.toNumber(); i++) {
        const course = await courseContract.courses(i);
        if (course.isActive) {
          coursesArray.push({
            id: course.web2CourseId,
            name: course.name,
            price: course.price.toString()
          });
        }
      }
      console.log('Courses:', coursesArray);
      
      
      setCourses(coursesArray);
    } catch (err) {
      console.error('获取课程列表失败:', err);
      setError('获取课程列表失败');
    }
  };

  // 检查所有课程状态
  const checkAllCoursesStatus = async (): Promise<void> => {
    if (!courseContract || !userAddress) return;

    try {
      const statusPromises = courses.map(async (course) => {
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

  useEffect(() => {
    if (courseContract) {
      // 获取课程列表
      fetchCourses();
    }
  }, [courseContract]);

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

        const ownerAddress = await contract.owner();
        setIsOwner(ownerAddress.toLowerCase() === address.toLowerCase());

        // 初始化后获取课程列表
        // await fetchCourses();
      } catch (err) {
        console.error('课程合约初始化失败:', err);
        setError('课程合约初始化失败');
      }
    };

    initContract();
  }, [provider]);

  useEffect(() => {
    checkAllCoursesStatus();
  }, [courseContract, userAddress, courses]);

  const handleAddCourse = async (): Promise<void> => {
    if (!courseContract || !isOwner) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const price = parseInt(newCourse.price);
      const tx = await courseContract.addCourse(uuidv4(), newCourse.name, price);
      await tx.wait();

      await fetchCourses();
      await checkAllCoursesStatus();

      setSuccess(`课程 ${newCourse.name} 添加成功！`);
      setIsDialogOpen(false);
      setNewCourse({ id: '', name: '', price: '' });
    } catch (err: any) {
      setError(err.message || '上架课程失败');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-400">课程市场</h2>
              {isOwner && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsDialogOpen(true)}
                >
                  添加课程
                </Button>
              )}
            </div>

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
                    <div className="mt-2">
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

      {/* 添加课程对话框 */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>添加新课程</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="课程名称"
              value={newCourse.name}
              onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="课程价格(YD)"
              type="number"
              value={newCourse.price}
              onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>取消</Button>
          <Button onClick={handleAddCourse} disabled={loading}>
            确认添加
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CourseCard;