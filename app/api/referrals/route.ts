// app/api/referrals/route.ts
import { getReferrals, getReferrer, saveReferral } from '@/lib/storage';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId, referrerId } = await request.json();
  
  if (!userId || !referrerId) {
    return NextResponse.json({ error: 'Missing userId or referrerId' }, { status: 400 });
  }

  await saveReferral(userId, referrerId); // Make sure to await the function
  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const referrals = await getReferrals(userId); // Await the function
  const referrer = await getReferrer(userId); // Await the function

  return NextResponse.json({ referrals, referrer });
}