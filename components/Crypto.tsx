'use client';

import { useEffect, useState } from 'react';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { crypto } from '@/images';
import Image from 'next/image';
import WebApp from '@twa-dev/sdk';

// DynamoDB Client Setup
const dynamoDBClient = new DynamoDBClient({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
    secretAccessKey: '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',
  },
});

const FriendsTab = () => {
  const [userData, setUserData] = useState<{ id: number } | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    // Ensure the code runs only in the client-side environment
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      // Set user data in state
      setUserData(WebApp.initDataUnsafe.user as { id: number });
    }
  }, []);

  // Query DynamoDB to get wallet address
  useEffect(() => {
    if (userData?.id) {
      const fetchWalletAddress = async () => {
        try {
          const params = {
            TableName: 'PandaPals',
            KeyConditionExpression: 'UserID = :userID',
            ExpressionAttributeValues: {
              ':userID': { N: userData.id.toString() },
            },
          };

          const { Items } = await dynamoDBClient.send(new QueryCommand(params));

          if (Items && Items.length > 0) {
            const wallet = Items[0].WalletAddress.S;
            setWalletAddress(wallet || 'nfwuj848...jdwndj8477');
          } else {
            setWalletAddress('nfwuj848...jdwndj8477');
          }
        } catch (error) {
          console.error('Error fetching wallet address:', error);
          setWalletAddress('nfwuj848...jdwndj8477');
        }
      };

      fetchWalletAddress();
    }
  }, [userData]);

  return (
    <div className="friends-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      {/* Header Section */}
      <div className="flex justify-between items-center pt-4 w-full px-2">
        {/* Left Icon with Text */}
        <div className="flex items-center space-x-2">
          <Image src={crypto} alt="" width={32} height={32} className="rounded-full" />
          <span className="text-white font-semibold">Crypto</span>
        </div>

        {/* Right Text */}
        <span className="text-white font-semibold">Investment</span>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold">Your wallet</p>
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2">
          <p className="text-white text-sm">{walletAddress}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-white font-semibold">Amount</p>
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2">
          <p className="text-white text-sm">Amount</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2 flex justify-between items-center">
          <p className="text-white text-sm">Min Deposit:</p>
          <p className="text-white text-sm">0.01 TON</p>
        </div>
      </div>

      <div className="mt-3 bg-yellow-800 p-4 border-2 border-dotted border-[gold] rounded-lg">
        <div className="text-[gold] text-center py-2">
          <p className="font-semibold">Note</p>
        </div>
        <div className="text-white text-sm mt-2">
          <p>If you send an amount less than the minimum deposit, It will not be added to your account.</p>
          <p className="mt-2">You are only allowed to send through the connected wallet. If you send from other wallets or make deposit through exchanges, the funds will not be added to your account.</p>
        </div>
      </div>
      {/* Button below the Note Section */}
      <div className="mt-4 flex justify-center">
        <button className="w-full max-w-xs border-2 border-transparent rounded-lg bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)] py-3 px-4 font-semibold text-lg">
          Generate Transaction
        </button>
      </div>
    </div>
  );
};

export default FriendsTab;
