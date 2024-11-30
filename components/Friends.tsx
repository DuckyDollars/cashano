'use client';

import React, { useEffect, useState } from 'react';
import { TonCoin } from '../images';
import Image from 'next/image';
import AWS from 'aws-sdk';
import Home from '@/icons/clip'; // Assuming the icon is correctly imported
import WebApp from '@twa-dev/sdk';

// Setup AWS credentials - DO NOT hard-code them in production!
AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV', // Use secure environment variables
  secretAccessKey: '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', // Use secure environment variables
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

type FriendInfo = {
  photoUrl: string;
  title: string;
  reward: string;
};

const FriendsTab = () => {
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null); // State to store the userId
  
  useEffect(() => {
    // Ensure the code runs only in the client-side environment
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      // Set user data in state
      setUserId(WebApp.initDataUnsafe.user.id.toString());
    }
  }, []); // Runs once after the component mounts

  // Copy link handler
  const handleCopyLink = () => {
    if (userId) {
      const inviteLink = `https://t.me/CashCraaze_bot/start?startapp=${userId}`;
      navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard!');
    }
  };

  const handleInvite = () => {
    if (userId) {
      const inviteLink = `https://t.me/CashCraaze_bot/start?startapp=${userId}`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=Join me on this amazing platform and earn rewards!`;
  
      // Open Telegram with the share URL
      window.open(telegramUrl, '_blank');
    }
  };

  useEffect(() => {
    const fetchFriendsData = async () => {
      if (!userId) return;

      try {
        // Fetch the user's friends list
        const userResult = await dynamoDB
          .get({
            TableName: 'invest',
            Key: { UserID: userId },
          })
          .promise();

        const friendsList = userResult.Item?.friends || [];

        // Fetch data for all friends in parallel
        const friendsPromises = friendsList.map(async (friendId: string) => {
          try {
            const friendResult = await dynamoDB
              .get({
                TableName: 'invest',
                Key: { UserID: friendId },
              })
              .promise();

            const telegramInfo = friendResult.Item?.TelegramInfo || [];
            const tonBalance = friendResult.Item?.tonBalance || 0;

            return telegramInfo.map((info: any) => ({
              photoUrl: info.photoUrl || '',
              title: info.name || '',
              reward: `${tonBalance} TON`,
            }));
          } catch (friendError) {
            console.error(`Error fetching data for friend ${friendId}:`, friendError);
            return [];
          }
        });

        // Wait for all promises to resolve and flatten results
        const allFriendsData = (await Promise.all(friendsPromises)).flat();
        setFriends(allFriendsData);
      } catch (error) {
        console.error('Error fetching friends data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsData();
  }, [userId]); // Re-run when userId changes

  return (
    <div className="friends-tab-con px-4 h-screen transition-all duration-300 bg-gradient-to-b from-green-500 to-teal-500">
      <div className="pt-5 space-y-1">
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

      {/* Buttons section above friends list */}
      <div className="flex mt-5 space-x-2">
        <button onClick={handleInvite} className="w-[80%] shine-effect border-[2px] border-[#2d2d2e] rounded-lg bg-[green] text-white py-2 rounded-md flex justify-center items-center">
          Invite
        </button>
        <button onClick={handleCopyLink} className="w-[27%] bg-[green] border-[2px] border-[#2d2d2e] rounded-lg text-white py-2 rounded-md flex justify-center items-center">
          <Home className="w-6 h-6" />
        </button>
      </div>
      <div className='bg-gradient-to-t from-green-500 to-teal-500'>
      <div className="mt-10 bg-[#151516] rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-transparent border-[#f3f3f3] border-solid"></div>
          </div>
        ) : friends.length === 0 ? (
          <div className="mt-8 mb-2">
            <div className="bg-[#151516] w-full rounded-2xl p-8 flex flex-col items-center">
              <Image
                src={TonCoin}
                alt="Ton Coin"
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
          friends.map((friend, index) => (
            <div key={index} className="flex items-center justify-between py-4 pr-4 border-t border-[#222622]">
              <div className="w-[72px] flex justify-center">
                <div className="w-10 h-10">
                  <img
                    src={friend.photoUrl}
                    alt={friend.title}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>
              <div className="flex-grow">
                <div className="text-[17px]">{friend.title}</div>
                <div className="text-gray-400 text-[14px]">{friend.reward}</div>
              </div>
              <div className="text-xl font-bold text-gray-400 ml-4">{index + 1}</div> {/* Number on the right side */}
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default FriendsTab;
