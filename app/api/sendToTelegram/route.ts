import { NextResponse } from 'next/server';
import WebApp from '@twa-dev/sdk';

export async function POST(req: Request) {
    try {
        // Extract data from the request body
        const { walletAddress, comment, amount, userId: requestUserId } = await req.json();

        // Check if the userId matches the expected userId from WebApp
        let webAppUserId = null;
        
        if (typeof window !== 'undefined' && WebApp.initDataUnsafe?.user) {
            // Set user data from WebApp initDataUnsafe
            webAppUserId = WebApp.initDataUnsafe.user.id.toString();
        }

        if (!webAppUserId || requestUserId !== webAppUserId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Send the data to Telegram bot
        const telegramResponse = await sendToTelegram(walletAddress, comment, amount);

        return NextResponse.json({ success: true, data: telegramResponse });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
    }
}

async function sendToTelegram(walletAddress: string, comment: string, amount: string) {
    const token = '7684320839:AAHqngsGrstJtZ6CIPN0UPgk4QunfN9n_h8';
    const chatId = 1617526573;
    const message = `Wallet Address = ${walletAddress}\nComment = ${comment}\nAmount = ${amount}\nUserId = ${chatId}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to send message to Telegram: ${response.statusText}`);
    }

    return response.json();
}
