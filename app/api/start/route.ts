import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { body } = await req.json(); // Parse incoming request
  const token = '8134486746:AAFH9tkjQ54B0uxLyV88xN85h_KD3SJcU0w';
  const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  if (body?.message?.text?.startsWith('/start')) {
    const chatId = body.message.chat.id;

    const payload = {
      chat_id: chatId,
      text: 'Welcome to CashCraze',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Button 1', callback_data: 'button1_action' },
            { text: 'Button 2', callback_data: 'button2_action' },
          ],
        ],
      },
    };

    // Send the welcome message
    await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Send the image
    const photoPayload = {
      chat_id: chatId,
      photo: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmSNqiLPnkkACtC69JbfJ8sgmREJsXeRV7YkioxkEi1ZtF',
    };

    await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photoPayload),
    });
  }

  return NextResponse.json({ success: true });
}
