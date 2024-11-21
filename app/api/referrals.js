import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const docClient = new AWS.DynamoDB.DocumentClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    const params = {
      TableName: 'PandaPals',
      Key: { UserID: userId },
    };

    const result = await docClient.get(params).promise();
    const friends = result.Item?.friends || [];
    return new Response(JSON.stringify({ friends }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch referrals:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch referrals' }), { status: 500 });
  }
}
