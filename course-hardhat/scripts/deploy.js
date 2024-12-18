const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. 首先部署 YiDengToken
  console.log("Deploying YiDengToken...");
  const YiDengToken = await ethers.getContractFactory("YiDengToken");
  const yiDengToken = await YiDengToken.deploy();
  await yiDengToken.waitForDeployment();
  const tokenAddress = await yiDengToken.getAddress();
  console.log("YiDengToken deployed to:", tokenAddress);

  // 2. 然后部署 CourseMarket，传入 YiDengToken 地址
  console.log("Deploying CourseMarket...");
  const CourseMarket = await ethers.getContractFactory("CourseMarket");
  const courseMarket = await CourseMarket.deploy(tokenAddress);
  await courseMarket.waitForDeployment();
  const marketAddress = await courseMarket.getAddress();
  console.log("CourseMarket deployed to:", marketAddress);

  // 3. 执行初始代币分配
  console.log("Performing initial token distribution...");
  const teamWallet = deployer.address;    // 替换为实际的团队钱包地址
  const marketingWallet = deployer.address; // 替换为实际的营销钱包地址
  const communityWallet = '0x9186De394Bf324fB7F2Bc5D663f8ff00CBa49489'; // 替换为实际的社区钱包地址

  try {
    const tx = await yiDengToken.distributeInitialTokens(
      teamWallet,
      marketingWallet,
      communityWallet
    );
    await tx.wait();
    console.log("Initial token distribution completed");
  } catch (error) {
    console.error("Error during initial distribution:", error);
  }

  // 4. 打印所有部署的合约地址
  console.log("\nDeployment Summary:");
  console.log("--------------------");
  console.log("YiDengToken:", tokenAddress);
  console.log("CourseMarket:", marketAddress);

  // 5. 导出地址以便验证
  console.log("\nVerification commands:");
  console.log("--------------------");
  console.log(`npx hardhat verify --network sepolia ${tokenAddress}`);
  console.log(`npx hardhat verify --network sepolia ${marketAddress} ${tokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });