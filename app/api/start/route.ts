import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
  secretAccessKey: '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',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || !body.message.from) {
      return NextResponse.json({ success: false, error: 'Invalid request' });
    }

    const { first_name: name, username, id: telegramId } = body.message.from;
    const photoUrl = `https://t.me/i/userpic/${telegramId}.jpg`;

    // Save user data in DynamoDB
    const params = {
      TableName: 'invest',
      Item: {
        UserID: telegramId.toString(),
        Name: name,
        PhotoUrl: photoUrl,
        Username: username || null,
      },
    };

    await dynamoDB.put(params).promise();

    // Send response to Telegram
    const token = '7684320839:AAHqngsGrstJtZ6CIPN0UPgk4QunfN9n_h8';
    const responseMessage = `Welcome! Your data has been saved in DynamoDB.`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: body.message.chat.id,
        text: responseMessage,
      }),
    });

    return NextResponse.json({ success: true, message: 'User data saved.' });
  } catch (error: unknown) {
    // Type assertion for the error object
    if (error instanceof Error) {
      console.error('Error handling Telegram webhook:', error);
      return NextResponse.json({ success: false, error: error.message });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ success: false, error: 'An unknown error occurred' });
    }
  }
}
