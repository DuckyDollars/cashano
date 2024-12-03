"use client";

import { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { TonCoin } from '../images';
import Image from 'next/image';
import WebApp from '@twa-dev/sdk';

// Configure AWS SDK
AWS.config.update({
    region: 'eu-north-1',
    accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
    secretAccessKey: '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',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const Withdraw = () => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [userId, setUserId] = useState<string>('');  // Fixed to set userId
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isButtonEnabled = address.trim() !== '' && Number(amount) >= 3;

    useEffect(() => {
        if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
            setUserId(WebApp.initDataUnsafe.user.id.toString());
        }
    }, []); 

    const formatDate = (date: Date | string | number): string => {
        const validDate = new Date(date);

        if (isNaN(validDate.getTime())) {
            throw new Error('Invalid date');
        }

        const year = validDate.getFullYear();
        const month = String(validDate.getMonth() + 1).padStart(2, '0');
        const day = String(validDate.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!isButtonEnabled) return;
    
        setIsSubmitting(true);
    
        try {
            // Fetch the user's tonBalance from DynamoDB
            const result = await dynamoDB
                .get({
                    TableName: 'invest',
                    Key: { UserID: userId },
                })
                .promise();
    
            const userBalance = result.Item?.tonBalance || 0;
    
            if (userBalance < Number(amount)) {
                return;
            }
    
            const payload = {
                walletAddress: address,
                comment: comment,
                amount: amount,
                userId: userId,
            };
    
            // Simulate sending to Telegram
            const response = await fetch('/api/sendToTelegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Update tonBalance and transaction history in DynamoDB
                const transactionData = {
                    date: formatDate(new Date()),
                    price: payload.amount,
                    title: 'Sent',
                    photoUrl: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmP43PA88CS4sFrx13yv13gBtTJGka4NS9fuYWj4hVjvUN',
                };
    
                await dynamoDB
                    .update({
                        TableName: 'invest',
                        Key: { UserID: userId },
                        UpdateExpression: `
                            SET 
                                transactionHistory = list_append(if_not_exists(transactionHistory, :emptyList), :newTransaction)
                        `,
                        ExpressionAttributeValues: {
                            ':amount': Number(amount),
                            ':emptyList': [],
                            ':newTransaction': [transactionData],
                        },
                    })
                    .promise();
            } else {
                console.error('Failed to send data to Telegram');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="friends-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
            {/* Header Section */}
            <div className="flex justify-between items-center pt-4 w-full px-2">
                {/* Left Icon with Text */}
                <div className="flex items-center space-x-2">
                    <Image
                        src={TonCoin}
                        alt="TonCoin"
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <span className="text-white font-semibold">TonCoin</span>
                </div>

                {/* Right Text */}
                <span className="text-white font-semibold">Withdraw</span>
            </div>

            {/* Wallet Address Input */}
            <div className="mt-3">
                <p className="text-white font-semibold">Your Wallet</p>
                <input
                    id="wallet"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Wallet Address"
                    className="w-full border-2 border-white rounded-lg mt-2 p-2 text-white bg-transparent placeholder-white"
                />
            </div>

            {/* Comment Input */}
            <div className="mt-3">
                <p className="text-white font-semibold">Comment</p>
                <input
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter Comment"
                    className="w-full border-2 border-white rounded-lg mt-2 p-2 text-white bg-transparent placeholder-white"
                />
            </div>

            {/* Amount Input */}
            <div className="mt-3">
                <p className="text-white font-semibold">Amount</p>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border-2 border-white rounded-lg mt-2 p-2 text-white bg-transparent placeholder-white"
                />
            </div>
            <div className="mt-3">
                <div className="w-full border-2 border-white rounded-lg mt-2 p-2 flex justify-between items-center">
                    <p className="text-white text-sm">Min Withdraw:</p>
                    <p className="text-white text-sm">3 TON</p>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleSubmit}
                    className={`w-full max-w-xs border-2 border-transparent rounded-lg py-3 px-4 font-semibold text-lg ${isButtonEnabled ? 'bg-blue-500 text-white' : 'bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]'}`}
                    disabled={isSubmitting || !isButtonEnabled}
                >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
            </div>
        </div>
    );
};

export default Withdraw;
