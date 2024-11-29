'use client';

import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',  // Replace with secure method for secrets
  secretAccessKey: 'X8fTA+HvyfDLk0m3+u32gtcOyWe+yiJJZ0GegssZ',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

type FriendInfo = {
  photoUrl: string;
  title: string;
  reward: string;
};

const TasksTab = () => {
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFriendsData = async () => {
      const userId = '1617526573'; // Replace with dynamic user ID if necessary
      try {
        const result = await dynamoDB
          .get({
            TableName: 'invest',
            Key: { UserID: userId },
          })
          .promise();

        const friendsList = result.Item?.friends || [];

        const friendsData: FriendInfo[] = [];

        for (const friendId of friendsList) {
          const friendResult = await dynamoDB
            .get({
              TableName: 'invest',
              Key: { UserID: friendId },
            })
            .promise();

          const telegramInfo = friendResult.Item?.TelegramInfo || [];

          telegramInfo.forEach((info: any) => {
            friendsData.push({
              photoUrl: info.PhotoUrl,
              title: info.title,
              reward: `${friendResult.Item?.tonBalance || 0}TON`,
            });
          });
        }

        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsData();
  }, []);

  return (
    <div className="quests-tab-con h-screen bg-gradient-to-t from-green-500 to-teal-500 px-4 transition-all duration-300">
      <div className="pt-2"></div>

      <div className="mb-20 bg-[#151516] rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-transparent border-[#f3f3f3] border-solid"></div>
          </div>
        ) : (
          friends.map((friend, index) => (
            <div key={index} className="flex items-center">
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
              <div className={`flex items-center justify-between w-full py-4 pr-4 ${index !== 0 && "border-t border-[#222622]"}`}>
                <div>
                  <div className="text-[17px]">{friend.title}</div>
                  <div className="text-gray-400 text-[14px]">{friend.reward}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksTab;
