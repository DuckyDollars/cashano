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


    { title: 'Monthly Challenge 1', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 2', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 3', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 4', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },
    { title: 'Monthly Challenge 5', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmPUtt4gNqNa7tVS5uNG5peaoxdGHiVC3uJKpokdg2djWY' },

    { title: 'Yearly Challenge 1', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 2', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 3', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 4', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
    { title: 'Yearly Challenge 5', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmNqEvPnJXMFcvApDaXLKZ7SHmsDer344v962G4Hf1cBbn' },
  ]);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedTasks, setPurchasedTasks] = useState<{ [key: string]: boolean }>({});

  const formatDate = (date: Date | string | number): string => {
    // Ensure date is a Date object
    const validDate = new Date(date);
    
    // Check if the Date is invalid
    if (isNaN(validDate.getTime())) {
        throw new Error('Invalid date');
    }

    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
    const day = String(validDate.getDate()).padStart(2, '0'); // Ensure two-digit day
    return `${year}/${month}/${day}`;
};

  useEffect(() => {
    const fetchPurchasedTasks = async () => {
      try {
        const userId = '1617526573'; // Replace with dynamic user ID if necessary
        const result = await dynamoDB
          .get({
            TableName: 'invest',
            Key: { UserID: userId },
          })
          .promise();
  
        if (result.Item) {
          const purchased = result.Item.purchasedTasks || {}; // Assuming the purchased tasks are stored under 'purchasedTasks'
          setPurchasedTasks(purchased);
        }
      } catch (error) {
        console.error('Error fetching purchased tasks:', error);
      }
    };
  
    fetchPurchasedTasks();
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
  
    if (purchasedTasks[activeTask.title]) return; // Prevent duplicate purchases
  
    setIsProcessing(true);
  
    try {
      // Fetch the user's tonBalance and transaction history from DynamoDB
      const result = await dynamoDB
        .get({
          TableName: 'invest',
          Key: { UserID: userId },
        })
        .promise();
  
      const tonBalance = result.Item?.tonBalance || 0;
      const transactionHistory = result.Item?.transactionHistory || []; // Retrieve the transaction history
  
      if (tonBalance >= activeTask.price) {
        const updatedBalance = tonBalance - activeTask.price;
  
        // Create a new transaction record
        const transaction = {
          date: formatDate(new Date()), // Using the formatted date
          price: activeTask.price,
          title: activeTask.title,
          photoUrl: "https://brown-just-donkey-162.mypinata.cloud/ipfs/QmfFXvEm29S9WjqGZfKSRQzLKALpejN3ZuPQh149AZAdvr",
        };
        
  
        // Update the balance and transaction history in DynamoDB
        await dynamoDB
          .update({
            TableName: 'invest',
            Key: { UserID: userId },
            UpdateExpression:
              'SET tonBalance = :balance, #field = :date, purchasedTasks = :purchasedTasks, transactionHistory = :transactionHistory',
            ExpressionAttributeValues: {
              ':balance': updatedBalance,
              ':date': new Date().toISOString(),
              ':purchasedTasks': {
                ...purchasedTasks,
                [activeTask.title]: true, // Mark task as purchased
              },
              ':transactionHistory': [...transactionHistory, transaction], // Append new transaction to history
            },
            ExpressionAttributeNames: {
              '#field': activeTask.title,
            },
          })
          .promise();
  
        // Update local state to reflect the purchase
        setPurchasedTasks((prev) => ({
          ...prev,
          [activeTask.title]: true,
        }));
  
        // Show "Transaction Successful" for 2 seconds
        setTimeout(() => setIsProcessing(false), 2000);
      } else {
        navigator.vibrate(200); // Insufficient balance feedback
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
          Biweekly
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
          Annually
        </button>
      </div>
      <div className="mt-4 mb-20 bg-[#151516] rounded-xl">
      {filteredTasks.map((task, index) => (
  <div key={index} className="flex items-center" onClick={() => handleTaskClick(index)}>
    <div className="w-[72px] flex justify-center">
      <div className="w-10 h-10">
        {purchasedTasks[task.title] ? (
          <img
            src="https://brown-just-donkey-162.mypinata.cloud/ipfs/QmZ73JeLs9ksHt4odBctHVzb4qc9BTEUKUmZaF2r7Rrn5Y"
            alt="Transaction Successful"
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={task.icon}
            alt={task.title}
            className="w-full h-full object-contain rounded-full"
          />
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
      {!purchasedTasks[task.title] && (
        <button
          onClick={handleGenerateTransaction}
          disabled={isProcessing}
          className={`w-20 h-10 bg-green-500 rounded-md text-white ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? 'Processing...' : 'Buy'}
        </button>
      )}
    </div>
  </div>
))}
      </div>
    </div>
  );
};

export default TasksTab;
