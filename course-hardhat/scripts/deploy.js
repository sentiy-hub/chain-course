const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const LaoyuanERC721 = await ethers.getContractFactory("LaoyuanERC721Coin");
  const nftContract = await LaoyuanERC721.deploy("Laoyuan NFT", "LYNFT");
  await nftContract.waitForDeployment();
  const nftAddress = await nftContract.getAddress();
  console.log("LaoyuanERC721Coin deployed to:", nftAddress);
  
  console.log("\nVerification command:");
  console.log(`npx hardhat verify --network sepolia ${nftAddress} "Laoyuan NFT" "LYNFT"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });