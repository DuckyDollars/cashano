'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTab } from '@/contexts/TabContext';
import { TonCoin } from '@/images';
import Wallet from '@/icons/Wallet';
import Invest from '@/icons/InvetLogo';
import ArrowRight from '@/icons/ArrowRight';
import TasksTab from './History'; // Import the TasksTab component
import Header from './Header';
import NavigationBar from './NavigationBar';
import WebApp from '@twa-dev/sdk';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV', // Use secure environment variables
  secretAccessKey: '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', // Use secure environment variables
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const HomeTab = () => {
  const { setActiveTab } = useTab();
  const [tonBalance, setTonBalance] = useState(null);
  const [income, setIncome] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      // Set user data in state
      setUserId(WebApp.initDataUnsafe.user.id.toString());
    }
    const fetchBalance = async () => {
      try {
        const userResult = await dynamoDB
          .get({
            TableName: 'invest',
            Key: { UserID: userId },
          })
          .promise();

        setTonBalance(userResult.Item?.tonBalance || 0);
        calculateIncome(userResult.Item?.purchasedTasks || {});
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);

  // Function to calculate the total income based on purchased tasks
  const calculateIncome = (purchasedTasks) => {
    let totalIncome = 0;
    
    for (let taskKey in purchasedTasks) {
      const { price, reward } = purchasedTasks[taskKey];

      // Calculate income for each task
      const incomeForTask = price * (reward / 100) + price;
      totalIncome += incomeForTask;
    }

    setIncome(totalIncome);
  };

  return (
    <div className="h-screen w-screen flex flex-col transition-all duration-300 bg-teal-500 pt-[54px]">
      <Header />
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
              <div className="text-2xl font-bold">
                {tonBalance !== null ? `${tonBalance.toFixed(2)}` : 'Loading...'}
              </div>
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
              <div className="text-2xl font-bold">{income ? `${income.toFixed(2)}` : 'Loading...'}</div>
            </div>
            <div className="bg-black p-2">
              <div className="mt-0 text-lg font-semibold text-white">InCome</div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section with White Background and Buttons */}
      <div className="w-full bg-gradient-to-t from-green-500 to-teal-500 px-4 py-8">
        <div className="space-y-3">
          <button
            onClick={() => setActiveTab('invest')}
            className="shine-effect w-full bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 font-medium">
              <Invest className="w-8 h-8" />
              <span>Invest Now</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className="w-full bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between mt-3"
          >
            <div className="flex items-center gap-3 font-medium">
              <Wallet className="w-8 h-8" />
              <span>Connect Wallet</span>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      {/* New Section with Black Background for Recent Transactions */}
      <div className="w-full bg-gradient-to-b from-green-500 to-teal-500 text-white p-4">
        <div className="text-xl font-semibold">Recent Transactions</div>
      </div>
      <TasksTab />
      <NavigationBar />
    </div>
  );
};

export default HomeTab;
