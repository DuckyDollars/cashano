'use client';

import React, { useState, useEffect } from 'react';

type Task = {
  title: string;
  price: number;
  reward: string;
  icon?: string;
  type: 'weekly' | 'monthly' | 'yearly';
};

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
    const userTonBalance = await fetchTonBalance(); // Implement this function to get the balance from DynamoDB.

    if (userTonBalance >= activeTask.price) {
      setIsProcessing(true);
      // Save task title and date to DynamoDB
      await saveTaskToDynamoDB(activeTask.title, new Date().toISOString());
      setIsProcessing(false);
      alert('Transaction generated successfully!');
    } else {
      // Vibrate and shake button
      navigator.vibrate(200);
      alert('Insufficient balance!');
    }
  };

  const saveTaskToDynamoDB = async (title: string, date: string) => {
    // Implement API call to save data to DynamoDB
    console.log(`Saving to DynamoDB: ${title}, ${date}`);
  };

  const fetchTonBalance = async () => {
    // Mock function. Replace with actual DynamoDB query
    return 150; // Example balance
  };

  return (
    <div className="quest-tab-con h-screen flex flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      {/* Tab Switcher */}
      <div className="flex gap-4 mt-4">
        {['weekly', 'monthly', 'yearly'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabSwitch(tab as 'weekly' | 'monthly' | 'yearly')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
              activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="mt-4 mb-20 bg-gray-800 rounded-xl">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            onClick={() => handleTaskClick(index)}
            className="flex items-center p-4 border-b border-gray-700"
          >
            <img src={task.icon} alt={task.title} className="w-12 h-12 rounded-full" />
            <div className="ml-4">
              <div className="text-lg font-bold">{task.title}</div>
              <div className="text-gray-400">{task.price} TonCoin</div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Transaction Button */}
      <div className="sticky bottom-0 w-full bg-transparent px-8">
        <button
          onClick={handleGenerateTransaction}
          className={`w-full max-w-xs mx-auto py-4 px-4 font-semibold text-lg rounded-lg ${
            activeTaskIndex !== null && !isProcessing
              ? 'bg-blue-500 text-white'
              : 'bg-gray-500 text-gray-300'
          }`}
          disabled={isProcessing || activeTaskIndex === null}
        >
          {isProcessing ? 'Loading...' : 'Generate Transaction'}
        </button>
      </div>
    </div>
  );
};

export default TasksTab;
