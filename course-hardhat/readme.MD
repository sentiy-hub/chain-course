<!-- truffle develop -->
<!-- truffle compile --reset
truffle migrate --reset
yarn run generate-types -->

npx hardhat compile

# 本地网络
npx hardhat run scripts/deploy.js

# 测试网(如Sepolia)
npx hardhat run scripts/deploy.js --network sepolia

npx hardhat verify --network sepolia <合约地址> [构造函数参数]

npx hardhat test

npx hardhat clean