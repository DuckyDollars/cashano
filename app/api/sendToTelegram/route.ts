// app/api/sendToTelegram/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { walletAddress, comment, amount, userId } = await req.json();

        // Check the userId to ensure it's allowed
        if (userId !== 1617526573) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        // Send the data to Telegram bot (you can use your own function here)
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

    // Define the inline keyboard with a button that will send a callback
    const inlineKeyboard = {
        inline_keyboard: [
            [
                {
                    text: "Withdraw Successful",
                    callback_data: "withdraw_successful", // Callback data that your bot will receive
                }
            ]
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            reply_markup: inlineKeyboard, // Add the inline keyboard to the message
        }),
    });

    return response.json();
}
