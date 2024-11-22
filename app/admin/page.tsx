'use client';

import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

// AWS Configuration
AWS.config.update({
  region: 'eu-north-1',
  credentials: new AWS.Credentials({
    accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
    secretAccessKey: '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',
  }),
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Tasks'; // DynamoDB table name

// Task Type interface
interface Task {
  taskId: string;
  title: string;
  reward: string;
  icon: string;
  type: 'weekly' | 'monthly' | 'yearly'; // Type for task frequency
  price: string; // Added price field
}

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskReward, setNewTaskReward] = useState<string>('');
  const [newTaskIcon, setNewTaskIcon] = useState<string>('');
  const [newTaskType, setNewTaskType] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [newTaskPrice, setNewTaskPrice] = useState<string>(''); // New state for price

  // Fetch tasks from DynamoDB
  const fetchTasks = async () => {
    try {
      const params = {
        TableName: TABLE_NAME,
      };

      const data = await dynamoDB.scan(params).promise();
      setTasks(data.Items as Task[] || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTaskTitle || !newTaskReward || !newTaskIcon || !newTaskType || !newTaskPrice) {
      alert('Please enter all fields: task title, reward, icon, type, and price.');
      return;
    }

    const task: Task = {
      taskId: Date.now().toString(), // Unique ID for each task
      title: newTaskTitle,
      reward: newTaskReward,
      icon: newTaskIcon,
      type: newTaskType, // 'weekly', 'monthly', 'yearly'
      price: newTaskPrice, // Save the price field
    };

    try {
      const params = {
        TableName: TABLE_NAME,
        Item: task,
      };

      await dynamoDB.put(params).promise();
      setTasks((prevTasks) => [...prevTasks, task]);
      setNewTaskTitle('');
      setNewTaskReward('');
      setNewTaskIcon('');
      setNewTaskType('weekly'); // Reset to default
      setNewTaskPrice(''); // Reset price field
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Remove a task
  const removeTask = async (taskId: string) => {
    try {
      const params = {
        TableName: TABLE_NAME,
        Key: { taskId },
      };

      await dynamoDB.delete(params).promise();
      setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add New Task */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="Task Reward"
          value={newTaskReward}
          onChange={(e) => setNewTaskReward(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="Task Icon URL"
          value={newTaskIcon}
          onChange={(e) => setNewTaskIcon(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="Task Price"
          value={newTaskPrice}
          onChange={(e) => setNewTaskPrice(e.target.value)}
          className="border p-2 mr-2 rounded text-black"
        />
        <select
          value={newTaskType}
          onChange={(e) => setNewTaskType(e.target.value as 'weekly' | 'monthly' | 'yearly')}
          className="border p-2 mr-2 rounded text-black"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded text-black"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul className="list-disc pl-5">
        {tasks.map((task) => (
          <li key={task.taskId} className="mb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {task.icon && (
                  <img
                    src={task.icon}
                    alt={task.title}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                <span>
                  <strong>{task.title}</strong> - {task.reward} - {task.type} - ${task.price} {/* Display the price */}
                </span>
              </div>
              <button
                onClick={() => removeTask(task.taskId)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
