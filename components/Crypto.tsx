'use client';

import React, { useState } from 'react';

type Task = {
  title: string;
  price: number;
  reward: string;
  icon?: string;
  type: 'weekly' | 'monthly' | 'yearly'; // Adjust this type based on your requirements
};

const TasksTab = () => {
  const [tasks] = useState<Task[]>([
    { title: 'Weekly Challenge 1', price: 100, reward: '+10%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Weekly Challenge 2', price: 200, reward: '+20%', type: 'weekly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Monthly Challenge', price: 300, reward: '+30%', type: 'monthly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
    { title: 'Yearly Challenge', price: 500, reward: '+50%', type: 'yearly', icon: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmXaUMRP7oLpfXsw4b78u3Jf6PxYStfFFYWUcp2d2g4RUg' },
  ]);

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => task.type === activeTab);

  const handleTabSwitch = (tab: 'weekly' | 'monthly' | 'yearly') => {
    setActiveTab(tab);
    setActiveTaskIndex(null); // Reset active task when switching tabs
  };

  const handleTaskClick = (index: number) => {
    setActiveTaskIndex(index); // Set the active task when clicked
  };



  return (
    <div className="quest-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      {/* Tab Switcher */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleTabSwitch('weekly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
            activeTab === 'weekly' ? 'bg-[green] text-white' : 'bg-[#151515] text-white'
          }`}
        >
          Weekly
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

      {/* Tasks List */}
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
    </div>
  );
};

export default TasksTab;
