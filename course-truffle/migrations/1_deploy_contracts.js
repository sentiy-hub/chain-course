const YiDengToken = artifacts.require('YiDengToken');
const CourseMarket = artifacts.require('CourseMarket');

module.exports = async function (deployer) {
  // 部署 YiDengToken
  await deployer.deploy(YiDengToken);
  const yiDengToken = await YiDengToken.deployed();

  // 部署 CourseMarket，并传入 YiDengToken 的地址
  await deployer.deploy(CourseMarket, yiDengToken.address);
};
