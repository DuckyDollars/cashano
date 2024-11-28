import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
  secretAccessKey: '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',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Function to get the user's profile photo URL from Telegram
async function getTelegramProfilePhotoUrl(telegramId: number, token: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getUserProfilePhotos?user_id=${telegramId}`);
    const data = await response.json();

    if (data.ok && data.result.photos.length > 0) {
      const photoFileId = data.result.photos[0][0].file_id; // Get the first photo
      const fileResponse = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${photoFileId}`);
      const fileData = await fileResponse.json();

      if (fileData.ok) {
        const filePath = fileData.result.file_path;
        return `https://api.telegram.org/file/bot${token}/${filePath}`; // Construct the photo URL
      } else {
        throw new Error('Error fetching file details');
      }
    } else {
      throw new Error('No profile photos available');
    }
  } catch (error) {
    console.error('Error getting profile photo:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || !body.message.from) {
      return NextResponse.json({ success: false, error: 'Invalid request' });
    }

    const { first_name: name, username, id: telegramId } = body.message.from;
    const token = '7684320839:AAHqngsGrstJtZ6CIPN0UPgk4QunfN9n_h8';

    // Get the Telegram profile photo URL
    const photoUrl = await getTelegramProfilePhotoUrl(telegramId, token);

    // Save user data in DynamoDB (with TelegramInfo as a list containing username and photoUrl)
    const params = {
      TableName: 'invest',
      Item: {
        UserID: telegramId.toString(),
        Name: name,
        TelegramInfo: [
          {
            Username: username || null,
            PhotoUrl: photoUrl || null,
          },
        ],
      },
    };

    await dynamoDB.put(params).promise();

    // Send response to Telegram
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
