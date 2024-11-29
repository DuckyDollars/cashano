'use client'

import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV', // Use secure methods to manage these keys (e.g., environment variables)
  secretAccessKey: 'X8fTA+HvyfDLk0m3+u32gtcOyWe+yiJJZ0GegssZ',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string; // User's profile photo
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const saveToDynamoDB = async (data: UserData) => {
    try {
      const userId = data.id.toString(); // Convert user ID to string if required by DynamoDB
  
      // Step 1: Retrieve existing TelegramInfo
      const existingData = await dynamoDB
        .get({
          TableName: 'invest',
          Key: { UserID: userId },
          ProjectionExpression: 'TelegramInfo',
        })
        .promise();
  
      const existingTelegramInfo = existingData.Item?.TelegramInfo || [];
  
      // Step 2: Check if the exact data already exists
      const isDuplicate = existingTelegramInfo.some(
        (info: { name: string; photoUrl: string; username: string }) =>
          info.name === data.first_name &&
          info.photoUrl === (data.photo_url || 'default-profile.png') &&
          info.username === (data.username || 'N/A')
      );
  
      // Step 3: If not a duplicate, save the data
      if (!isDuplicate) {
        await dynamoDB
          .update({
            TableName: 'invest',
            Key: { UserID: userId },
            UpdateExpression:
              'SET TelegramInfo = list_append(if_not_exists(TelegramInfo, :emptyList), :newInfo)',
            ExpressionAttributeValues: {
              ':emptyList': [],
              ':newInfo': [
                {
                  name: data.first_name,
                  photoUrl: data.photo_url || 'default-profile.png',
                  username: data.username || 'N/A',
                },
              ],
            },
            ReturnValues: 'UPDATED_NEW',
          })
          .promise();
  
        console.log('Data saved to DynamoDB successfully');
      } else {
        console.log('Duplicate data found. Skipping save.');
      }
    } catch (error) {
      console.error('Error saving to DynamoDB:', error);
    }
  };
  

  useEffect(() => {
    // Ensure the code runs only in the client-side environment
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);

      // Save the user data to DynamoDB on window load
      saveToDynamoDB(user);
    }
  }, []);

  return null
}

export default Profile;
