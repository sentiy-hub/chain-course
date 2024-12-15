"use client"
import { useEffect, useState, JSX } from 'react';
import { Wallet, BarChart2, BookOpen } from 'lucide-react';
import MetaMaskCard from '@/components/connectorCards/MetaMaskCard';
import { hooks } from '@/components/connections/metaMask';
import CourseCard from "@/components/CourseCard";
import TokenMarket from "@/components/TokenMarket";
import { YiDengToken__factory } from '@/abis/types';
import YiDengAbi from '@/abis/YiDengToken.json';

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
}

const tabs: Tab[] = [
  { id: 'wallet', label: '连接钱包', icon: <Wallet className="w-5 h-5" /> },
  { id: 'token', label: '代币市场', icon: <BarChart2 className="w-5 h-5" /> },
  { id: 'course', label: '课程市场', icon: <BookOpen className="w-5 h-5" /> },
];

const NavigationTabs = () => {
  const [activeTab, setActiveTab] = useState<string>('wallet');
  const [contract, setContract] = useState<ReturnType<typeof YiDengToken__factory.connect> | null>(null);
  
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
      } catch (err) {
        console.error('合约初始化失败:', err);
      }
    };

    initContract();
  }, [provider]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
      <nav className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
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
        {activeTab === 'wallet' && 
          <div className="text-gray-900">
            <MetaMaskCard />
          </div>
        }
        {activeTab === 'token' && 
          <div className="text-gray-900">
            <TokenMarket provider={provider} contract={contract} />
          </div>
        }
        {activeTab === 'course' && 
          <div className="text-gray-900">
            <CourseCard provider={provider} yiDengContract={contract} />
          </div>
        }
      </div>
    </div>
  );
};

export default NavigationTabs;