"use client"
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowRightLeft, ShoppingCart, DollarSign } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { YiDengToken__factory } from '@/abis/types';
import { yiDengTokenAddress } from '@/abis/Address';

const YDMarket = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [contract, setContract] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  
  const { address } = useAccount();

  // 初始化provider和contract
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined' && address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = YiDengToken__factory.connect(yiDengTokenAddress, signer);
        
        setProvider(provider);
        setContract(contract);
      }
    };

    init();
  }, [address]);

  // 获取余额
  useEffect(() => {
    const fetchBalances = async () => {
      if (!contract || !provider || !address) return;

      try {
        const ethBal = await provider.getBalance(address);
        const tokenBal = await contract.balanceOf(address);
        
        setEthBalance(ethers.utils.formatEther(ethBal));
        setBalance(ethers.utils.formatUnits(tokenBal, 18));
      } catch (err) {
        console.error('获取余额失败:', err);
      }
    };

    fetchBalances();
  }, [contract, provider, address, success]);

  // 处理交易
  const handleSubmit = async (type: 'buy' | 'sell' | 'transfer') => {
    if (!address || !contract) {
      alert('请先连接钱包');
      return;
    }

    try {
      setPending(true);
      setError('');
      setSuccess('');

      switch (type) {
        case 'buy':
          const buyTx = await contract.buyWithETH({
            value: ethers.utils.parseEther(amount),
          });
          await buyTx.wait();
          break;
          
        case 'sell':
          const sellTx = await contract.sellTokens(
            ethers.utils.parseUnits(amount, 18)
          );
          await sellTx.wait();
          break;
          
        case 'transfer':
          if (!recipient) {
            setError('请输入接收方地址');
            return;
          }
          if (!ethers.utils.isAddress(recipient)) {
            setError('无效的接收地址');
            return;
          }
          const transferTx = await contract.transfer(
            recipient,
            ethers.utils.parseUnits(amount, 18)
          );
          await transferTx.wait();
          break;
      }

      setSuccess('交易成功！');
      setAmount('');
      if (type === 'transfer') {
        setRecipient('');
      }

    } catch (err: any) {
      console.error('交易失败:', err);
      setError(err.message || '交易失败');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      {/* UI部分与原文件相同 */}
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          YD币交易中心
        </h1>

        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-gray-100">选择交易类型</h2>
          </div>
          
          <div className="p-4">
            <div className="flex gap-2 p-1 bg-gray-700 rounded-lg mb-4">
              <button
                onClick={() => setActiveTab('buy')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors focus:outline-none ${
                  activeTab === 'buy' ? 'text-white bg-blue-600' : ''
                }`}
                disabled={isPending}
              >
                购买
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors focus:outline-none ${
                  activeTab === 'sell' ? 'text-white bg-blue-600' : ''
                }`}
                disabled={isPending}
              >
                出售
              </button>
              <button
                onClick={() => setActiveTab('transfer')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-colors focus:outline-none ${
                  activeTab === 'transfer' ? 'text-white bg-blue-600' : ''
                }`}
                disabled={isPending}
              >
                转账
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-900/20 text-red-400 p-3 rounded-md border border-red-800/50">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-900/20 text-green-400 p-3 rounded-md border border-green-800/50">
                {success}
              </div>
            )}

            {activeTab === 'buy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="text-blue-400" />
                    <span className="text-white">购买YD币</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm text-gray-400">
                      ETH余额: {Number(ethBalance).toFixed(4)} ETH
                    </div>
                    <div className="text-sm text-gray-400">
                      YD余额: {balance} YD
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入ETH数量"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPending}
                />
                <div className="text-sm text-gray-400 text-right">
                  预计获得: {amount ? Number(amount) * 1000 : 0} YD
                </div>
                <button 
                  onClick={() => handleSubmit('buy')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isPending || !amount}
                >
                  {isPending ? '处理中...' : '确认购买'}
                </button>
              </div>
            )}

            {activeTab === 'sell' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-blue-400" />
                    <span className="text-white">出售YD币</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm text-gray-400">
                      ETH余额: {Number(ethBalance).toFixed(4)} ETH
                    </div>
                    <div className="text-sm text-gray-400">
                      可用YD: {balance} YD
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入YD币数量"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPending}
                />
                <div className="text-sm text-gray-400 text-right">
                  预计获得: {amount ? Number(amount) / 1000 : 0} ETH
                </div>
                <button 
                  onClick={() => handleSubmit('sell')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isPending || !amount}
                >
                  {isPending ? '处理中...' : '确认出售'}
                </button>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="text-blue-400" />
                    <span className="text-white">转账YD币</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    可用: {balance} YD
                  </div>
                </div>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="接收方地址"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPending}
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入转账数量"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPending}
                />
                <button 
                  onClick={() => handleSubmit('transfer')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isPending || !amount || !recipient}
                >
                  {isPending ? '处理中...' : '确认转账'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YDMarket;