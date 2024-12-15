// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./YiDengToken.sol";

contract CourseMarket is Ownable {
    // YiDeng代币合约实例
    YiDengToken public yiDengToken;

    // 修改构造函数，使用 address payable
    constructor(address payable _yiDengToken) Ownable(msg.sender) {
        yiDengToken = YiDengToken(_yiDengToken);
    }

    // 课程结构体定义
    struct Course {
        string web2CourseId; // Web2平台的课程ID
        string name; // 课程名称
        uint256 price; // 课程价格(YD代币)
        bool isActive; // 课程是否可购买
        address creator; // 课程创建者地址
    }

    // 存储所有课程的映射：courseId => Course
    mapping(uint256 => Course) public courses;

    // web2CourseId到courseId的映射关系
    mapping(string => uint256) public web2ToCourseId;

    // 用户购买记录映射：用户地址 => courseId => 是否购买
    mapping(address => mapping(uint256 => bool)) public userCourses;

    // 课程总数计数器
    uint256 public courseCount;

    // 定义事件，记录课程购买
    event CoursePurchased(
        address indexed buyer,
        uint256 indexed courseId,
        string web2CourseId
    );

    /**
     * @notice 使用web2CourseId购买课程
     * @param web2CourseId Web2平台的课程ID
     * @dev 用户通过Web2课程ID购买课程，自动查找对应的链上课程ID
     */
    function purchaseCourse(string memory web2CourseId) external {
        // 获取链上课程ID
        uint256 courseId = web2ToCourseId[web2CourseId];

        // 确保课程存在
        require(courseId > 0, "Course does not exist");

        // 获取课程信息
        Course memory course = courses[courseId];

        // 确保课程处于可购买状态
        require(course.isActive, "Course not active");

        // 确保用户未购买过该课程
        require(!userCourses[msg.sender][courseId], "Already purchased");

        // 确保web2CourseId匹配
        require(
            keccak256(abi.encodePacked(course.web2CourseId)) ==
                keccak256(abi.encodePacked(web2CourseId)),
            "Course ID mismatch"
        );

        // 调用YD代币合约的transferFrom函数，转移代币给课程创建者
        require(
            yiDengToken.transferFrom(
                msg.sender, // 从购买者账户
                course.creator, // 转给课程创建者
                course.price // 转移课程价格对应的代币数量
            ),
            "Transfer failed"
        );

        // 记录购买状态
        userCourses[msg.sender][courseId] = true;

        // 触发购买事件
        emit CoursePurchased(msg.sender, courseId, web2CourseId);
    }

    /**
     * @notice 检查用户是否已购买课程
     * @param user 用户地址
     * @param web2CourseId Web2平台的课程ID
     * @return bool 是否已购买
     */
    function hasCourse(
        address user,
        string memory web2CourseId
    ) external view returns (bool) {
        uint256 courseId = web2ToCourseId[web2CourseId];
        require(courseId > 0, "Course does not exist");
        return userCourses[user][courseId];
    }

    /**
     * @notice 添加新课程
     * @param web2CourseId Web2平台的课程ID
     * @param name 课程名称
     * @param price 课程价格(YD代币)
     */
    function addCourse(
        string memory web2CourseId,
        string memory name,
        uint256 price
    ) external onlyOwner {
        // 确保web2CourseId不为空
        require(
            bytes(web2CourseId).length > 0,
            "Web2 course ID cannot be empty"
        );
        // 确保该web2CourseId尚未添加
        require(web2ToCourseId[web2CourseId] == 0, "Course already exists");

        // 递增课程计数器
        courseCount++;

        // 创建新课程
        courses[courseCount] = Course({
            web2CourseId: web2CourseId,
            name: name,
            price: price,
            isActive: true,
            creator: msg.sender
        });

        // 建立web2CourseId到courseId的映射关系
        web2ToCourseId[web2CourseId] = courseCount;
    }
}
