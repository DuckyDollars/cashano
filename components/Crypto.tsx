'use client';

import React, { useEffect, useState } from 'react';
import { DynamoDBClient, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import WebApp from '@twa-dev/sdk';
import Image from 'next/image';
import { crypto } from '@/images';

const FriendsTab = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [buttonColor, setButtonColor] = useState('bg-[rgba(109,109,109,0.4)]');
    const [userData, setUserData] = useState({ id: 0 });
    const region = 'eu-north-1';

    const client = new DynamoDBClient({
        region,
        credentials: {
            accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
            secretAccessKey: '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',
        },
    });

    // State to manage WebApp initialization readiness
    const [isWebAppReady, setIsWebAppReady] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('WebApp:', WebApp);  // Log the WebApp object for debugging

            const user = WebApp.initDataUnsafe?.user;

            if (user && user.id) {
                setUserData(user);
                fetchWalletAddress(user.id);
                setIsWebAppReady(true);  // Set WebApp as ready after fetching user data
            } else {
                console.error('User data is not available or user ID is missing.');
            }
        }
    }, [isWebAppReady]);  // Re-run the effect if WebApp is initialized

    // Fetch wallet address from DynamoDB
    const fetchWalletAddress = async (userId: number) => {
        try {
            const command = new QueryCommand({
                TableName: 'PandaPals',
                KeyConditionExpression: 'UserID = :id',
                ExpressionAttributeValues: {
                    ':id': { N: `${userId}` },
                },
            });
            const response = await client.send(command);

            console.log('DynamoDB Response:', response);

            if (response.Items && response.Items.length > 0) {
                const wallet = response.Items[0]?.WalletAddress?.S;
                if (wallet) {
                    const formattedWallet = `${wallet.slice(0, 12)}...${wallet.slice(-12)}`;
                    setWalletAddress(formattedWallet);
                } else {
                    console.error('WalletAddress not found in response');
                }
            } else {
                console.error('No items found for the given UserID');
            }
        } catch (error) {
            console.error('Error fetching wallet address:', error);
        }
    };

    // Handle amount input change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value);

        // Validate amount
        if (parseInt(value) < 250) {
            setError('Minimum Invest = 250');
            setButtonColor('bg-[rgba(109,109,109,0.4)]');
        } else {
            setError('');
            setButtonColor('bg-blue-500');
        }
    };

    // Handle the transaction generation
    const handleGenerateTransaction = async () => {
        if (parseInt(amount) < 250) {
            setError('Minimum Invest = 250');
            return;
        }

        // Check TonBalance in DynamoDB
        try {
            const command = new QueryCommand({
                TableName: 'PandaPals',
                KeyConditionExpression: 'UserID = :id',
                ExpressionAttributeValues: {
                    ':id': { N: `${userData.id}` },
                },
            });
            const response = await client.send(command);

            if (response.Items && response.Items.length > 0) {
                const tonBalance = parseInt(response.Items[0].TonBalance.N || '0');
                if (tonBalance >= parseInt(amount)) {
                    // Update balance and save transaction
                    await client.send(
                        new UpdateItemCommand({
                            TableName: 'PandaPals',
                            Key: { UserID: { N: `${userData.id}` } },
                            UpdateExpression:
                                'SET TonBalance = TonBalance - :amount, MonthlyInvest = list_append(MonthlyInvest, :entry)',
                            ExpressionAttributeValues: {
                                ':amount': { N: amount },
                                ':entry': {
                                    L: [{ S: new Date().toISOString() }, { N: amount }],
                                },
                            },
                        })
                    );
                    setError('');
                    alert('Transaction Successful!');
                } else {
                    setError('Insufficient balance!');
                    navigator.vibrate(200);
                }
            }
        } catch (error) {
            console.error('Error during transaction:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="friends-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
            {/* Header Section */}
            <div className="flex justify-between items-center pt-4 w-full px-2">
                <div className="flex items-center space-x-2">
                    <Image src={crypto} alt="" width={32} height={32} className="rounded-full" />
                    <span className="text-white font-semibold">Crypto</span>
                </div>
                <span className="text-white font-semibold">Investment</span>
            </div>

            <div className="mt-3">
                <p className="text-white font-semibold">Your wallet</p>
                <div className="w-full border-2 border-white rounded-lg mt-2 p-2">
                    <p className="text-white text-sm">{walletAddress || 'Loading...'}</p>
                </div>
            </div>

            <div className="mt-3">
                <p className="text-white font-semibold">Amount</p>
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full border-2 border-white rounded-lg mt-2 p-2 text-white bg-transparent"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="mt-4 flex justify-center">
                <button
                    className={`w-full max-w-xs border-2 border-transparent rounded-lg ${buttonColor} text-white py-3 px-4 font-semibold text-lg`}
                    onClick={handleGenerateTransaction}
                >
                    Generate Transaction
                </button>
            </div>
        </div>
    );
};

export default FriendsTab;
