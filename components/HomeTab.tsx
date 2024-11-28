'use client';

import Image from 'next/image';
import Link from 'next/link'; // Import Link from Next.js
import { TonCoin } from '@/images';
import Wallet from '@/icons/Wallet';
import Invest from '@/icons/InvetLogo';
import ArrowRight from '@/icons/ArrowRight';

const HomeTab = () => {
  return (
    <div className="h-screen w-screen flex flex-col transition-all duration-300 bg-teal-500 pt-[54px]">
      
      <div className="w-full">
        <div className="flex w-full gap-4 bg-gradient-to-b from-green-500 to-teal-500 p-4">
          
          <div className="w-full sm:w-[200px] h-[170px] bg-blue-900 text-white text-center p-0 rounded-[15px] shadow-lg overflow-hidden">
            
            <div className="bg-blue-800 p-4">
              <div className="mb-6">
                <Image
                  src={TonCoin}
                  alt="Coin Icon"
                  className="w-10 h-10 mx-auto"
                />
              </div>
              <div className="text-2xl font-bold">$145</div>
            </div>

            <div className="bg-white p-2">
              <div className="mt-0 text-lg font-semibold text-[blue]">Balance</div>
            </div>
          </div>

          
          <div className="w-full sm:w-[200px] h-[170px] bg-green-700 text-white text-center p-0 rounded-[15px] shadow-lg overflow-hidden">
            
            <div className="bg-green-600 p-4">
              <div className="mb-6">
                <Image
                  src={TonCoin}
                  alt="Coin Icon"
                  className="w-10 h-10 mx-auto"
                />
              </div>
              <div className="text-2xl font-bold">$9.94</div>
            </div>

            <div className="bg-black p-2">
              <div className="mt-0 text-lg font-semibold text-white">In Invest</div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section with White Background and Buttons */}
      <div className="w-full bg-gradient-to-t from-green-500 to-teal-500 px-4 py-8">
        <div className="space-y-3">
          <Link href="/invest">
            <button className="shine-effect w-full bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3 font-medium">
                <Invest className="w-8 h-8" />
                <span>Invest Now</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </button>
          </Link>

          <Link href="/wallet">
            <button className="w-full bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 font-medium">
                <Wallet className="w-8 h-8" />
                <span>Connect Wallet</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </button>
          </Link>
        </div>
      </div>

      {/* New Section with Black Background for Recent Transactions */}
      <div className="w-full bg-gradient-to-b from-green-500 to-teal-500 text-white p-4">
        <div className="text-xl font-semibold mb-4">Recent Transactions</div>
        {/* Add transaction details here */}
        <div className="space-y-2">
          <div className="p-4 bg-[green] border-[2px] border-[#2d2d2e] rounded-lg">
            <div className="flex justify-between">
              <div className="text-sm">Investment</div>
              <div className="text-sm">$50</div>
            </div>
          </div>
          <div className="p-4 bg-[green] border-[2px] border-[#2d2d2e] rounded-lg">
            <div className="flex justify-between">
              <div className="text-sm">Deposit</div>
              <div className="text-sm">$200</div>
            </div>
          </div>
          <div className="p-4 bg-[green] border-[2px] border-[#2d2d2e] rounded-lg">
            <div className="flex justify-between">
              <div className="text-sm">Withdraw</div>
              <div className="text-sm">$200</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomeTab;
