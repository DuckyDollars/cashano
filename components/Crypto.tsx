'use client';

import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

type Task = {
  title: string;
  price: number;
  reward: string;
  icon?: string;
  type: 'weekly' | 'monthly' | 'yearly';
};

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
  secretAccessKey: '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',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TasksTab = () => {
  const [tasks] = useState<Task[]>([
    { title: 'Weekly Challenge 1', price: 100, reward: '+10%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Weekly Challenge 2', price: 200, reward: '+20%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Weekly Challenge 3', price: 100, reward: '+10%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Weekly Challenge 4', price: 200, reward: '+20%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Weekly Challenge 5', price: 100, reward: '+10%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Weekly Challenge 6', price: 200, reward: '+20%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },


    { title: 'Monthly Challenge 1', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 2', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 3', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 4', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 5', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 6', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },

    { title: 'Yearly Challenge 1', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 2', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 3', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 4', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 5', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 6', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
  ]);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedTask = localStorage.getItem('activeTask');
    if (savedTask) {
      const { tab, index } = JSON.parse(savedTask);
      setActiveTab(tab);
      setActiveTaskIndex(index);
    }
  }, []);

  const filteredTasks = tasks.filter((task) => task.type === activeTab);

  const handleTabSwitch = (tab: 'weekly' | 'monthly' | 'yearly') => {
    setActiveTab(tab);
    setActiveTaskIndex(null);
  };

  const handleTaskClick = (index: number) => {
    setActiveTaskIndex(index);
    const activeTask = filteredTasks[index];
    localStorage.setItem(
      'activeTask',
      JSON.stringify({
        tab: activeTab,
        index,
        title: activeTask.title,
        price: activeTask.price,
      })
    );
  };

  const handleGenerateTransaction = async () => {
    if (activeTaskIndex === null) return;

    const activeTask = filteredTasks[activeTaskIndex];
    const userId = '1617526573'; // Replace with dynamic user ID if necessary

    setIsProcessing(true);

    try {
      // Fetch the user's tonBalance from DynamoDB
      const result = await dynamoDB
        .get({
          TableName: 'invest',
          Key: { UserID: userId },
        })
        .promise();

      const tonBalance = result.Item?.tonBalance || 0;

      if (tonBalance >= activeTask.price) {
        // Deduct the price from the user's tonBalance
        const updatedBalance = tonBalance - activeTask.price;

        await dynamoDB
          .update({
            TableName: 'invest',
            Key: { UserID: userId },
            UpdateExpression: 'SET tonBalance = :balance, #field = :date',
            ExpressionAttributeValues: {
              ':balance': updatedBalance,
              ':date': new Date().toISOString(),
            },
            ExpressionAttributeNames: {
              '#field': activeTask.title,
            },
          })
          .promise();

        alert('Transaction successful!');
      } else {
        // Insufficient balance: shake the button and vibrate
        navigator.vibrate(200); // Trigger device vibration
        alert('Insufficient balance!');
      }
    } catch (error) {
      console.error('Error generating transaction:', error);
      alert('An error occurred. Please try again.');
    }

    setIsProcessing(false);
  };

  return (
    <div className="quest-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleTabSwitch('weekly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
            activeTab === 'weekly' ? 'bg-[green] text-white' : 'bg-[#151515] text-white'
          }`}
        >
          2Week
        </button>
        <button
          onClick={() => handleTabSwitch('monthly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
            activeTab === 'monthly' ? 'bg-[green] text-white' : 'bg-[#151515] text-white'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => handleTabSwitch('yearly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
            activeTab === 'yearly' ? 'bg-[green] text-white' : 'bg-[#151515] text-white'
          }`}
        >
          Yearly
        </button>
      </div>
      <div className="mt-4 mb-20 bg-[#151516] rounded-xl">
        {filteredTasks.map((task, index) => (
          <div key={index} className="flex items-center" onClick={() => handleTaskClick(index)}>
            <div className="w-[72px] flex justify-center">
              <div className="w-10 h-10">
                {task.icon ? (
                  <img
                    src={task.icon}
                    alt={task.title}
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-500 rounded-full" />
                )}
              </div>
            </div>
            <div
              className={`flex items-center justify-between w-full py-4 pr-4 ${
                index !== 0 && 'border-t border-[#222622]'
              }`}
            >
              <div>
                <div className="text-[17px]">{task.title}</div>
                <div className="text-gray-400 text-[14px]">{task.price} TonCoin</div>
              </div>
              <div
                className={`w-10 h-10 border-2 ${
                  activeTaskIndex === index ? 'bg-green-500' : 'border-green-500'
                } rounded-full flex items-center justify-center`}
              >
                <div className={`${activeTaskIndex === index ? 'hidden' : 'text-gray-400 text-[12px]'}`}>
                  {task.reward}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 w-full bg-transparent px-8">
        <button
          className={`w-full max-w-xs mx-auto border-2 border-transparent rounded-lg py-4 px-4 font-semibold text-lg transition-colors duration-300 ${
            activeTaskIndex !== null
              ? 'bg-blue-500 text-white'
              : 'bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]'
          }`}
          onClick={handleGenerateTransaction}
          disabled={isProcessing || activeTaskIndex === null}
          style={{ animation: isProcessing ? 'shake 0.3s' : 'none' }}
        >
          {isProcessing ? 'Loading...' : 'Generate Transaction'}
        </button>
      </div>
    </div>
  );
};

export default TasksTab;
