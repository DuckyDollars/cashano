'use client';

import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { WebApp } from '@twa-dev/sdk';  // Ensure this import is correct

// AWS Configuration
AWS.config.update({
  region: 'eu-north-1',
  credentials: new AWS.Credentials({
    accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
    secretAccessKey: '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',
  }),
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TASKS_TABLE_NAME = 'Tasks'; // DynamoDB table name
const INVEST_TABLE_NAME = 'invest'; // DynamoDB table name for user data

const TasksTab = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null); // Track active task
  const [loading, setLoading] = useState(false); // Loading state for button
  const [userData, setUserData] = useState<any>(null); // User data to fetch tonBalance

  // Fetch tasks from DynamoDB
  const fetchTasks = async () => {
    try {
      const params = { TableName: TASKS_TABLE_NAME };
      const data = await dynamoDB.scan(params).promise();
      setTasks(data.Items || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    // Fetch user data from WebApp SDK
    if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);
    }
  }, []);

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => task.type === activeTab);

  // Handle task click
  const handleTaskClick = (index: number) => {
    setActiveTaskIndex(index); // Set the active task on click
  };

  const handleTransaction = async () => {
    if (activeTaskIndex === null || !userData) return;

    setLoading(true); // Set loading state for the button

    const selectedTask = filteredTasks[activeTaskIndex];
    const taskPrice = selectedTask.price; // Price of the task

    // Fetch user's tonBalance from the invest table
    const params = {
      TableName: INVEST_TABLE_NAME,
      Key: { UserID: userData.id },
    };

    try {
      const userDataResponse = await dynamoDB.get(params).promise();
      const userDataItem = userDataResponse.Item;

      if (!userDataItem || userDataItem.tonBalance < taskPrice) {
        alert("Insufficient balance!");
        setLoading(false);
        return;
      }

      // Proceed with transaction
      const updatedTonBalance = userDataItem.tonBalance - taskPrice;

      // Prepare the update data
      const transactionMetadata = {
        TableName: INVEST_TABLE_NAME,
        Key: { UserID: userData.id },
        UpdateExpression: "SET tonBalance = :tonBalance, #indexTitle = :indexTitle, transactionDate = :transactionDate",
        ExpressionAttributeNames: {
          '#indexTitle': 'indexTitle',
        },
        ExpressionAttributeValues: {
          ":tonBalance": updatedTonBalance,
          ":indexTitle": selectedTask.title,
          ":transactionDate": new Date().toISOString(),
        },
      };

      // Update the user's data in DynamoDB
      await dynamoDB.update(transactionMetadata).promise();

      // Transaction successful, update the button text and reset state
      setLoading(false);
      alert("Transaction successful!");
    } catch (error) {
      console.error("Error during transaction:", error);
      setLoading(false);
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
          className={`w-full max-w-xs border-2 border-transparent rounded-lg py-3 px-4 font-semibold text-lg ${
            activeTaskIndex !== null
              ? 'bg-blue-500 text-white'
              : 'bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]'
          }`}
        >
          {loading ? 'Loading...' : 'Generate Transaction'}
        </button>
      </div>
    </div>
  );
};

export default TasksTab;
