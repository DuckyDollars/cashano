'use client';

import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TonCoin } from '@/images';
import WebApp from '@twa-dev/sdk';

interface UserData {
  id: number;
}

const FriendsTab = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [referrals, setReferrals] = useState<string[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        if (WebApp.initDataUnsafe.user) {
          const user = WebApp.initDataUnsafe.user as UserData;
          setUserData(user);

          // Initialize DynamoDB Client
          const client = new DynamoDBClient({
            region: "eu-north-1",
            credentials: {
              accessKeyId: "AKIAUJ3VUKANTQKUIAXV",
              secretAccessKey: "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",
            },
          });

          // Query the DynamoDB Table
          const command = new QueryCommand({
            TableName: "PandaPals",
            KeyConditionExpression: "UserID = :userId",
            ExpressionAttributeValues: {
              ":userId": { S: `${user.id}` },
            },
          });

          const data = await client.send(command);
          const items = data.Items || [];
          const referralList = items.map((item) => item.ReferralID?.S || "");
          setReferrals(referralList);
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    };

    fetchReferrals();
  }, []);

  const handleInvite = () => {
    if (userData) {
      const inviteLink = `https://t.me/CashCraaze_bot/start?startapp=${userData.id}`;
      navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied!');
    }
  };

  return (
    <div className="friends-tab-con px-4 pb-24 transition-all duration-300 bg-gradient-to-b from-green-500 to-teal-500">
      <div className="pt-8 space-y-1">
        <h1 className="text-3xl font-bold">INVITE FRIENDS</h1>
        <div className="text-xl">
          <span className="font-semibold">SHARE</span>
          <span className="ml-2 text-gray-500">YOUR INVITATION</span>
        </div>
        <div className="text-xl">
          <span className="text-gray-500">LINK &</span>
          <span className="ml-2 font-semibold">GET 5%</span>
          <span className="ml-2 text-gray-500">OF</span>
        </div>
        <div className="text-gray-500 text-xl">FRIEND`S COMMUNICATION</div>
      </div>

      {referrals.length === 0 ? (
        <div className="mt-8 mb-2">
          <div className="bg-[#151516] w-full rounded-2xl p-8 flex flex-col items-center">
            <Image
              src={TonCoin}
              alt="Paws"
              width={171}
              height={132}
              className="mb-4"
            />
            <p className="text-xl text-[#8e8e93] text-center">
              There is nothing else.<br />
              Invite to get more rewards.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
          <ul>
            {referrals.map((referral, index) => (
              <li key={index} className="bg-gray-100 p-2 mb-2 rounded">
                User {referral}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="fixed bottom-[70px] left-0 right-0 py-14 flex justify-center bg-gradient-to-t from-green-500 to-teal-500">
        <div className="w-full max-w-md px-4">
          <button
            className="w-full bg-[#4c9ce2] text-white py-4 rounded-xl text-lg font-medium"
            onClick={handleInvite}
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;
