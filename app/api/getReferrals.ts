import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Use environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  // Use environment variables
});

const docClient = new AWS.DynamoDB.DocumentClient();

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    const params = {
      TableName: 'PandaPals',
      Key: { UserID: userId },
    };

    const result = await docClient.get(params).promise();
    if (result.Item && result.Item.friends) {
      return res.status(200).json({ referrals: result.Item.friends });
    } else {
      return res.status(404).json({ message: 'No referrals found' });
    }
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return res.status(500).json({ message: 'Error fetching referrals' });
  }
}
