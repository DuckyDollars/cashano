import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import Uparrow from '@/icons/Uparrow';
import DownArrow from '@/icons/Darrow';
import Image from 'next/image';
import { TonCoin } from '@/images';
import { TonConnectButton } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import { useTab } from '@/contexts/TabContext'
import NavigationBar from './NavigationBar'

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV', // Use secure environment variables
  secretAccessKey: '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', // Use secure environment variables
});


const dynamoDB = new AWS.DynamoDB.DocumentClient();

function Wallet() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tonBalance, setTonBalance] = useState('0.00');
  const { setActiveTab } = useTab()

  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe?.user) {
      setUserId(WebApp.initDataUnsafe.user.id.toString());
    }
  }, []);

  const fetchTonBalance = async () => {
    try {
      const result = await dynamoDB
        .get({
          TableName: 'invest',
          Key: { UserID: userId },
        })
        .promise();

      const balance = result.Item?.tonBalance || 0;
      setTonBalance(balance.toFixed(2));
    } catch (error) {
      console.error('Error fetching tonBalance:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTonBalance();
    }
  }, [userId]);

  return (
    <div className="home-tab-con transition-all duration-300 flex items-center justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500">
      <TonConnectButton className="bg-transparent text-black w-[35%] py-1 mt-5 rounded-lg" />
      <div className="text-white text-4xl mt-4">{tonBalance}TON</div>
      <div className="flex justify-between w-[35%] mt-8">
        <button onClick={() => setActiveTab('deposit')} className="flex flex-col items-center justify-center">
          <div className="bg-green-900 w-[50px] h-[50px] rounded-full flex items-center justify-center">
            <DownArrow className="w-8 h-8" />
          </div>
          <span className="text-white text-sm mt-2">Deposit</span>
        </button>
        <button onClick={() => setActiveTab('withdraw')} className="flex flex-col items-center justify-center">
          <div className="bg-green-900 w-[50px] h-[50px] rounded-full flex items-center justify-center">
            <Uparrow className="w-8 h-8" />
          </div>
          <span className="text-white text-sm mt-2">Withdraw</span>
        </button>
      </div>
      <div className="w-[98%] bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between mt-8">
        <div className="flex items-center gap-3 font-medium">
          <Image src={TonCoin} alt="ton" className="w-9 h-9" />
          <span className="text-white">TONCOIN</span>
        </div>
        <p className="text-white">{tonBalance}</p>
      </div>
      <NavigationBar />
    </div>
  );
}

export default Wallet;
