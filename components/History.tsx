'use client';

import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import Image from 'next/image';
import { logo } from '@/images';
import WebApp from '@twa-dev/sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV', // Replace with secure environment variable
  secretAccessKey: 'X8fTA+HvyfDLk0m3+u32gtcOyWe+yiJJZ0GegssZ', // Replace with secure environment variable
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

type Task = {
  icon: string | React.FC<{ className?: string }>;
  title: string;
  reward: string;
  date: string;
};

type Transaction = {
  photoUrl: string;
  title: string;
  price: number;
  date: string;
};

const TasksTab = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Extract user ID from Telegram WebApp SDK
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe?.user) {
      setUserId(WebApp.initDataUnsafe.user.id.toString());
    }
  }, []);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!userId) return; // Wait until userId is set

      try {
        const result = await dynamoDB
          .get({
            TableName: 'invest',
            Key: { UserID: userId },
          })
          .promise();

        const transactionHistory = result.Item?.transactionHistory || [];

        if (transactionHistory.length === 0) {
          setTasks([]);
        } else {
          const mappedTasks = transactionHistory.map((transaction: Transaction) => ({
            icon: transaction.photoUrl,
            title: transaction.title,
            reward: `${transaction.price}TON`,
            date: transaction.date,
          }));

          setTasks(mappedTasks);
        }
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [userId]); // Fetch transaction history only when userId is set

  return (
    <div className="quests-tab-con h-screen bg-gradient-to-t from-green-500 to-teal-500 px-4 transition-all duration-300">
      {/* Header */}
      <div className="pt-2"></div>

      <div className="mb-20 bg-[#151516] rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-t-transparent border-[#f3f3f3] border-solid"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-8 mb-2">
            <div className="bg-[#151516] w-full rounded-2xl p-8 flex flex-col items-center">
              <Image
                src={logo}
                alt=""
                width={171}
                height={132}
                className="mb-4 rounded-full"
              />
              <p className="text-xl text-[#8e8e93] text-center">
                There is nothing else.<br />
              </p>
            </div>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div key={index} className="flex items-center">
              <div className="w-[72px] flex justify-center">
                <div className="w-10 h-10">
                  {typeof task.icon === 'string' ? (
                    <img
                      src={task.icon}
                      alt={task.title}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain rounded-full"
                    />
                  ) : (
                    <task.icon className="w-full h-full" />
                  )}
                </div>
              </div>
              <div className={`flex items-center justify-between w-full py-4 pr-4 ${index !== 0 && 'border-t border-[#222622]'}`}>
                <div>
                  <div className="text-[17px]">{task.title}</div>
                  <div className="text-gray-400 text-[14px]">{task.reward}</div>
                </div>
                <div>{task.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-6 bg-transparent text-[1px]">.</div>
    </div>
  );
};

export default TasksTab;
