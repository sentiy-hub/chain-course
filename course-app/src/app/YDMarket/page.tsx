"use client"
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowRightLeft, ShoppingCart, DollarSign } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { parseEther, formatUnits, formatEther } from 'viem';
import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';

const YDCoinTransaction = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const { address } = useAccount();

  // 获取ETH余额
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // 代币合约地址
  const TOKEN_CONTRACT = '0x901a683A2B931f97d552513E33333039E8eA546e';

  // 合约 ABI
  const tokenAbi = [{
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  }, {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
  }, {
    name: 'buyWithETH',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  }, {
    name: 'sellTokens',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenAmount', type: 'uint256' }],
    outputs: [],
  }] as const;

  // 读取YD余额
  const { data: ydBalance, refetch: refetchYDBalance } = useReadContract({
    address: TOKEN_CONTRACT,
    abi: tokenAbi,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: Boolean(address),
    },
  });

  // 合约写入操作
  const { writeContract, isPending, isSuccess } = useWriteContract();

  // 监听Transfer事件
  useWatchContractEvent({
    address: TOKEN_CONTRACT,
    abi: tokenAbi,
    eventName: 'Transfer',
    onLogs(logs) {
      console.log('Transfer event:', logs);
      refetchYDBalance();
    },
  });

  // 处理交易提交
  const handleSubmit = async (type: 'buy' | 'sell' | 'transfer') => {
    if (!address) {
      alert('请先连接钱包');
      return;
    }

    try {
      switch (type) {
        case 'buy':
          const parsedAmount = parseEther(amount);
          await writeContract({
            address: TOKEN_CONTRACT,
            abi: tokenAbi,
            functionName: 'buyWithETH',
            value: parsedAmount,
          });
          break;
          
        case 'sell':
          const sellAmount = BigInt(amount);
          await writeContract({
            address: TOKEN_CONTRACT,
            abi: tokenAbi,
            functionName: 'sellTokens',
            args: [sellAmount],
          });
          break;
          
        case 'transfer':
          if (!recipient) {
            alert('请输入接收方地址');
            return;
          }
          const transferAmount = BigInt(amount);
          await writeContract({
            address: TOKEN_CONTRACT,
            abi: tokenAbi,
            functionName: 'transfer',
            args: [recipient as `0x${string}`, transferAmount],
          });
          break;
      }
    } catch (error) {
      console.error('交易失败:', error);
      alert('交易失败: ' + (error as Error).message);
    }
  };

  // 监听交易状态
  useEffect(() => {
    if (isSuccess) {
      alert('交易成功！');
      setAmount('');
      if (activeTab === 'transfer') {
        setRecipient('');
      }
      // 刷新余额
      refetchYDBalance();
    }
  }, [isSuccess, activeTab]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
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

            {activeTab === 'buy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="text-blue-400" />
                    <span className="text-white">购买YD币</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-sm text-gray-400">
                      ETH余额: {ethBalance ? Number(formatEther(ethBalance.value)).toFixed(2) : '0'} ETH
                    </div>
                    <div className="text-sm text-gray-400">
                      YD余额: {ydBalance ? formatUnits(ydBalance, 0) : '0'} YD
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
                      ETH余额: {ethBalance ? Number(formatEther(ethBalance.value)).toFixed(2) : '0'} ETH
                    </div>
                    <div className="text-sm text-gray-400">
                      可用YD: {ydBalance ? formatUnits(ydBalance, 0) : '0'} YD
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
                    可用: {ydBalance ? formatUnits(ydBalance, 0) : '0'} YD
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

export default YDCoinTransaction;