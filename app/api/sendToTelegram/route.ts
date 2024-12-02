import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { walletAddress, comment, amount, userId } = await req.json();

        const telegramResponse = await sendToTelegram(walletAddress, comment, amount, userId);

        return NextResponse.json({ success: true, data: telegramResponse });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
    }
}

async function sendToTelegram(walletAddress: string, comment: string, amount: string, userId: string) {
    const token = '7684320839:AAHqngsGrstJtZ6CIPN0UPgk4QunfN9n_h8';
    const chatId = 1617526573;  // Replace this with your chatId for the bot

    // Include the userId in the message instead of the chatId
    const message = `Wallet Address = ${walletAddress}\nComment = ${comment}\nAmount = ${amount}\nUserId = ${userId}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    });

    return response.json();
}
