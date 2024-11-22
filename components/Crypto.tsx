'use client' 

import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import WebApp from '@twa-dev/sdk';

// AWS Configuration
AWS.config.update({
  region: 'eu-north-1',
  credentials: new AWS.Credentials({
    accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
    secretAccessKey: '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',
  }),
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TASKS_TABLE_NAME = 'Tasks'; // DynamoDB table name for tasks
const INVEST_TABLE_NAME = 'invest'; // DynamoDB table name for user investments

// Define Task type
type Task = {
  title: string;
  price: number;
  reward: string;
  icon?: string;
  type: 'weekly' | 'monthly' | 'yearly'; // Adjust this type based on your actual data
};

const TasksTab = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null); // Track active task
  const [buttonText, setButtonText] = useState("Generate Transaction"); // For button text

  // User data state
  const [userData, setUserData] = useState<{ id: string | null }>({ id: null });

  // Fetch tasks from DynamoDB
  const fetchTasks = async () => {
    try {
      const params = { TableName: TASKS_TABLE_NAME };
      const data = await dynamoDB.scan(params).promise();
      setTasks((data.Items || []) as Task[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof WebApp !== 'undefined' && WebApp.initDataUnsafe?.user) {
      const user = WebApp.initDataUnsafe.user;
      
      if (user && typeof user.id === 'string') {
        setUserData({ id: user.id });
      } else {
        console.error('User data is missing the id or is not a string.');
      }
    } else {
      console.error('WebApp.initDataUnsafe or user is not available.');
    }
    fetchTasks(); // Fetch tasks on mount
  }, []);

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => task.type === activeTab);

  // Handle tab switch
  const handleTabSwitch = (tab: 'weekly' | 'monthly' | 'yearly') => {
    setActiveTab(tab);
    setActiveTaskIndex(null); // Reset active task when switching tabs
  };

  const handleTaskClick = (index: number) => {
    setActiveTaskIndex(index); // Set the active task when a task is clicked
    setButtonText("Generate Transaction"); // Reset the button text after task is selected
  };

  const handleTransaction = async () => {
    console.log("activeTaskIndex:", activeTaskIndex);
    console.log("userData.id:", userData.id);
  
    if (activeTaskIndex === null || userData.id === null) {
      setButtonText('Please select a task');
      return;
    }
  
    const task = tasks[activeTaskIndex];  // Get the selected task using the activeTaskIndex
    const price = task.price; // Price of the active task
  
    try {
      const userParams = {
        TableName: INVEST_TABLE_NAME,
        Key: { UserID: userData.id },
      };
  
      const userDataResponse = await dynamoDB.get(userParams).promise();
      const userInvestData = userDataResponse.Item;
  
      if (userInvestData) {
        const tonBalance = userInvestData.tonBalance || 0;
  
        if (tonBalance >= price) {
          const newTonBalance = tonBalance - price;
          const updateParams = {
            TableName: INVEST_TABLE_NAME,
            Key: { UserID: userData.id },
            UpdateExpression: 'set tonBalance = :newTonBalance, #transactionDate = :transactionDate, #transactionTitle = :transactionTitle',
            ExpressionAttributeNames: {
              '#transactionDate': 'transactionDate',
              '#transactionTitle': 'transactionTitle',
            },
            ExpressionAttributeValues: {
              ':newTonBalance': newTonBalance,
              ':transactionDate': new Date().toISOString(),
              ':transactionTitle': `Transaction for Task: ${task.title}`,
            },
          };
  
          await dynamoDB.update(updateParams).promise();
          setButtonText('Transaction Successful');
        } else {
          setButtonText('Insufficient Balance');
        }
      } else {
        setButtonText('User Not Found');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      setButtonText('Transaction Failed');
    }
  };
  

  return (
    <div className="quest-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      {/* Tab Switcher */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleTabSwitch('weekly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
            activeTab === 'weekly' ? 'bg-[green] text-black' : 'bg-[#151515] text-white'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => handleTabSwitch('monthly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
            activeTab === 'monthly' ? 'bg-[green] text-black' : 'bg-[#151515] text-white'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => handleTabSwitch('yearly')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
            activeTab === 'yearly' ? 'bg-[green] text-black' : 'bg-[#151515] text-white'
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
                    width={40}
                    height={40}
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
              {/* Circle to show reward */}
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

      {/* Button Section */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={handleTransaction}
          className={`w-full max-w-xs border-2 border-transparent rounded-lg py-3 px-4 font-semibold text-white transition-colors duration-200 ${
            activeTaskIndex === null ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default TasksTab;
