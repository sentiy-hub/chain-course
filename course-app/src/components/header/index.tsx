"use client"

import React from 'react';
import { PlusCircle, BookOpen, Wallet } from 'lucide-react';
import { ConnectKitButton } from "connectkit";
import Link from 'next/link';

const Header = () => {

  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between fixed top-0 left-0 z-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-200 dark:hover:bg-gray-700">
          <PlusCircle className="h-5 w-5" />
          <span>添加课程</span>
        </button>
        
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-200 dark:hover:bg-gray-700">
          <BookOpen className="h-5 w-5" />
          <span>课程列表</span>
        </button>

        <Link href="/YDMarket" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors dark:text-gray-200 dark:hover:bg-gray-700">
          <Wallet className="h-5 w-5" />
          <span>代币市场</span>
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
};

export default Header;