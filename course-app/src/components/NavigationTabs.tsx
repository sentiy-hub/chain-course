"use client"
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Wallet, BarChart2, BookOpen } from 'lucide-react';
import MetaMaskCard from '@/components/connectorCards/MetaMaskCard';
import { hooks } from '@/components/connections/metaMask';
import { ethers } from 'ethers';
import { Button } from '@mui/material';
import CourseCard from "@/components/CourseCard";
import TokenMarket from "@/components/TokenMarket";

import { YiDengToken__factory } from '@/abis/types';
import YiDengAbi from '@/abis/YiDengToken.json';

const tabs = [
  { id: 'wallet', label: '连接钱包', icon: <Wallet className="w-5 h-5" /> },
  { id: 'token', label: '代币市场', icon: <BarChart2 className="w-5 h-5" /> },
  { id: 'course', label: '课程市场', icon: <BookOpen className="w-5 h-5" /> },
];

const NavigationTabs = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  // 状态定义
  const [contract, setContract] = useState < ReturnType < typeof YiDengToken__factory.connect > | null > (
    null,
  );
  const [isPending, setPending] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [balance, setBalance] = useState < string > ('0');
  const [buyAmount, setBuyAmount] = useState < string > ('');
  const [sellAmount, setSellAmount] = useState < string > ('');
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    symbol: '',
    totalSupply: '0',
    remainingSupply: '0',
  });
  const [transferAddress, setTransferAddress] = useState < string > ('');
  const [transferAmount, setTransferAmount] = useState < string > ('');
  const [error, setError] = useState < string > ('');
  const [success, setSuccess] = useState < string > ('');



  const { useProvider } = hooks;
  const provider = useProvider();

  // 初始化合约
  useEffect(() => {
    const initContract = async () => {
      if (!provider) return;
      try {
        const signer = await provider.getSigner();
        const contractAddress = YiDengAbi.networks['5777'].address;
        const newContract = YiDengToken__factory.connect(contractAddress, signer);
        setContract(newContract);

        // 检查当前用户是否是合约拥有者
        const ownerAddress = await newContract.owner();
        const signerAddress = await signer.getAddress();
        setIsOwner(ownerAddress.toLowerCase() === signerAddress.toLowerCase());
      } catch (err) {
        console.error('合约初始化失败:', err);
      }
    };

    initContract();
  }, [provider]);

  // 获取代币信息
  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!contract || !provider) return;

      try {
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();

        // 检查初始化状态
        const initialized = await contract.initialDistributionDone();
        setIsInitialized(initialized);

        const [name, symbol, totalSupply, remainingSupply, userBalance] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.totalSupply(),
          contract.remainingMintableSupply(),
          contract.balanceOf(signerAddress),
        ]);

        setTokenInfo({
          name,
          symbol,
          totalSupply: totalSupply.toString(),
          remainingSupply: remainingSupply.toString(),
        });
        setBalance(userBalance.toString());
      } catch (err) {
        console.error('获取代币信息失败:', err);
        setError('获取代币信息失败');
      }
    };

    fetchTokenInfo();
  }, [contract, provider]);

  // 初始代币分配处理
  const handleInitialDistribution = async () => {
    if (!contract) return;
    try {
      setPending(true);
      setError('');
      setSuccess('');

      const signer = await provider?.getSigner();
      if (!signer) throw new Error('未找到签名者');

      const signerAddress = await signer.getAddress();

      // 使用当前用户地址作为团队、市场和社区钱包（仅用于测试）
      const tx = await contract.distributeInitialTokens(
        signerAddress, // 团队钱包
        signerAddress, // 市场营销钱包
        signerAddress, // 社区钱包
      );

      await tx.wait();

      // 更新初始化状态
      setIsInitialized(true);
      setSuccess('代币初始分配完成！');

      // 刷新代币信息
      const [totalSupply, remainingSupply, userBalance] = await Promise.all([
        contract.totalSupply(),
        contract.remainingMintableSupply(),
        contract.balanceOf(signerAddress),
      ]);

      setTokenInfo(prev => ({
        ...prev,
        totalSupply: totalSupply.toString(),
        remainingSupply: remainingSupply.toString(),
      }));
      setBalance(userBalance.toString());
    } catch (err: any) {
      setError(err.message || '代币初始分配失败');
    } finally {
      setPending(false);
    }
  };

  // 购买代币处理
  const handleBuy = async (e: FormEvent) => {
    e.preventDefault();
    if (!contract || !buyAmount) return;

    try {
      // setPending(true);
      // setError('');
      // setSuccess('');

      // 计算将获得的代币数量
      const tokenAmount = parseFloat(buyAmount) * 1000; // 1 ETH = 1000 tokens

      // 检查是否超过最大供应量
      const remainingSupply = await contract.remainingMintableSupply();

      console.log(buyAmount);
      console.log(remainingSupply.toString());
      // console.log(remainingSupply);
      // return;

      if (tokenAmount > Number(remainingSupply.toString())) {
        throw new Error(`超过可铸造上限，当前剩余可铸造数量: ${remainingSupply} 代币`);
      }

      const tx = await contract.buyWithETH({
        value: ethers.utils.parseEther(buyAmount),
      });

      const receipt = await tx.wait();
      console.log('交易回执:', receipt);

      // 更新余额
      const newBalance = await contract.balanceOf(await contract.signer.getAddress());
      setBalance(newBalance.toString());

      setSuccess('代币购买成功！');
      setBuyAmount('');
    } catch (err: any) {
      // 改善错误提示
      if (err.message.includes('Would exceed max supply')) {
        setError('超过最大供应量限制');
      } else {
        setError(err.message || '交易失败');
      }
    } finally {
      setPending(false);
    }
  };

  // 转账处理
  const handleTransfer = async (e: FormEvent) => {
    e.preventDefault();
    if (!contract || !transferAmount || !transferAddress) return;

    try {
      setPending(true);
      setError('');
      setSuccess('');

      // 验证地址格式
      if (!ethers.utils.isAddress(transferAddress)) {
        throw new Error('无效的接收地址');
      }

      // 验证转账金额
      const currentBalance = await contract.balanceOf(await contract.signer.getAddress());
      if (BigInt(transferAmount) > currentBalance) {
        throw new Error('余额不足');
      }

      const tx = await contract.transfer(transferAddress, transferAmount);
      const receipt = await tx.wait();
      console.log('交易回执:', receipt);

      // 更新余额
      const newBalance = await contract.balanceOf(await contract.signer.getAddress());
      setBalance(newBalance.toString());

      setSuccess('转账成功！');
      setTransferAmount('');
      setTransferAddress('');
    } catch (err: any) {
      setError(err.message || '转账失败');
    } finally {
      setPending(false);
    }
  };

  // 卖出代币处理
  const handleSell = async (e: FormEvent) => {
    e.preventDefault();
    if (!contract || !sellAmount) return;

    try {
      setPending(true);
      setError('');
      setSuccess('');

      const tx = await contract.sellTokens(sellAmount);
      const receipt = await tx.wait();
      console.log('交易回执:', receipt);

      // 更新余额
      const newBalance = await contract.balanceOf(await contract.signer.getAddress());
      setBalance(newBalance.toString());

      setSuccess('代币卖出成功！');
      setSellAmount('');
    } catch (err: any) {
      setError(err.message || '交易失败');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <nav className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="p-4 text-gray-900 min-h-48 sm:min-h-64 md:min-h-80">
        {activeTab === 'wallet' && <div className="text-gray-900"><MetaMaskCard /></div>}
        {activeTab === 'token' && <div className="text-gray-900">
          {/* <TokenMarket provider={provider} contract={contract} /> */}
          <div className="bg-gradient-to-b from-blue-800 to-blue-900 p-1 rounded-lg shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-px rounded-lg">
              <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6">
                {/* 初始化状态 */}
                {isOwner && !isInitialized && (
                  <div className="mb-6">
                    <div className="text-yellow-400 mb-2">⚠️ 合约尚未初始化</div>
                    <Button
                      variant="contained"
                      color="warning"
                      fullWidth
                      onClick={handleInitialDistribution}
                      disabled={isPending}
                    >
                      {isPending ? '初始化中...' : '初始化合约'}
                    </Button>
                  </div>
                )}

                {/* 代币信息 */}
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">
                    {tokenInfo.name} ({tokenInfo.symbol})
                  </h2>
                  <div className="space-y-2 text-blue-300">
                    <p>
                      你的余额: {balance} {tokenInfo.symbol}
                    </p>
                    <p>
                      总供应量: {tokenInfo.totalSupply} {tokenInfo.symbol}
                    </p>
                    <p>
                      剩余可铸造: {tokenInfo.remainingSupply} {tokenInfo.symbol}
                    </p>
                    <p>合约状态: {isInitialized ? '已初始化' : '未初始化'}</p>
                  </div>
                </div>

                {isInitialized && (
                  <>
                    {/* 购买代币表单 */}
                    <form onSubmit={handleBuy} className="mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-blue-400">
                          使用 ETH 购买代币
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.001"
                            min="0.001"
                            className="w-full px-4 py-2 bg-slate-800/50 border-2 border-blue-900/50 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-blue-400"
                            value={buyAmount}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setBuyAmount(e.target.value)
                            }
                            placeholder="输入 ETH 数量"
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          disabled={isPending}
                          className="mt-2"
                        >
                          {isPending ? '处理中...' : '购买代币'}
                        </Button>
                      </div>
                    </form>

                    {/* 卖出代币表单 */}
                    <form onSubmit={handleSell} className="mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-blue-400">卖出代币</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            className="w-full px-4 py-2 bg-slate-800/50 border-2 border-blue-900/50 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-blue-400"
                            value={sellAmount}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setSellAmount(e.target.value)
                            }
                            placeholder="输入代币数量"
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          fullWidth
                          disabled={isPending}
                          className="mt-2"
                        >
                          {isPending ? '处理中...' : '卖出代币'}
                        </Button>
                      </div>
                    </form>

                    {/* 转账表单 */}
                    <form onSubmit={handleTransfer}>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-blue-400">转账代币</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 bg-slate-800/50 border-2 border-blue-900/50 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-blue-400"
                            value={transferAddress}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setTransferAddress(e.target.value)
                            }
                            placeholder="输入接收地址"
                          />
                          <input
                            type="number"
                            min="1"
                            className="w-full px-4 py-2 bg-slate-800/50 border-2 border-blue-900/50 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-blue-400"
                            value={transferAmount}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setTransferAmount(e.target.value)
                            }
                            placeholder="输入转账数量"
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="contained"
                          color="info"
                          fullWidth
                          disabled={isPending}
                          className="mt-2"
                        >
                          {isPending ? '处理中...' : '转账代币'}
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {/* 错误和成功消息 */}
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
        </div>}
        {activeTab === 'course' && <div className="text-gray-900">
          <CourseCard provider={provider} yiDengContract={contract}></CourseCard></div>}
      </div>
    </div>
  );
};

export default NavigationTabs;