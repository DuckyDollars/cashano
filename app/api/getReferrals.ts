import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

// Initialize AWS SDK
AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Use environment variables for security
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const docClient = new AWS.DynamoDB.DocumentClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; // Extract userId from query parameters

  if (!userId) {
    res.status(400).json({ error: 'Missing userId parameter' });
    return;
  }

  try {
    // Query DynamoDB
    const params = {
      TableName: 'PandaPals',
      Key: { UserID: Number(userId) },
    };

    const result = await docClient.get(params).promise();
    if (result.Item && result.Item.friends) {
      res.status(200).json({ friends: result.Item.friends });
    } else {
      res.status(404).json({ error: 'No friends found' });
    }
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
