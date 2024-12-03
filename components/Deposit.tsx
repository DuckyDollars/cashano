"use client";

import React, { useState, useEffect } from 'react';
import { TonCoin } from '../images';
import Image from 'next/image';
import { useTonConnectUI } from "@tonconnect/ui-react";
import AWS from 'aws-sdk';
import WebApp from '@twa-dev/sdk';
import NavigationBar from './NavigationBar'

// Configure AWS
AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV', // Replace with secure methods for managing secrets
  secretAccessKey: 'X8fTA+HvyfDLk0m3+u32gtcOyWe+yiJJZ0GegssZ',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

function Deposit() {
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState(''); // State to hold the user input
  const [buttonDisabled, setButtonDisabled] = useState(true); // To track if the button is disabled
  const [userId, setUserId] = useState<string>(''); // To store user ID

  // Initialize Telegram WebApp and get user ID
  useEffect(() => {
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      setUserId(WebApp.initDataUnsafe.user.id.toString());
    }
  }, []); 

  // Handle user input changes for amount
  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setAmount(value);

    // Enable button only if the amount is valid
    setButtonDisabled(!(value && !isNaN(Number(value)) && Number(value) > 0));
  }

  // Connect wallet if not already connected
  async function connectWallet() {
    await tonConnectUI.openModal();
  }

  // Send a transaction
  async function sendTransaction() {
    // Check for required wallet data in localStorage
    const requiredKeys = [
      'ton-connect-ui_wallet-info',
      'ton-connect-ui_preferred-wallet',
      'ton-connect-ui_last-selected-wallet-info',
      'ton-connect-storage_bridge-connection',
    ];

    const missingData = requiredKeys.some(key => !localStorage.getItem(key));

    if (missingData) {
      await connectWallet();
      return; // Stop the transaction process
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.error("Invalid amount");
      return;
    }

    const transaction = {
      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
      messages: [
        {
          address: "0QDOV1efOQu-ZbT2JR5TSfuVLerbMQE9dm_ngNNBCirI0SQz",
          amount: (Number(amount) * 1000000000).toString(),
        },
      ],
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      console.log(`Successfully sent ${amount} TON`);
      await saveTransaction(userId, amount);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  // Save transaction details in DynamoDB
  async function saveTransaction(userId: string, amount: string | number) {
    const depositAmount = Number(amount);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '/');

    const transactionItem = {
      date,
      photoUrl: 'https://brown-just-donkey-162.mypinata.cloud/ipfs/QmT1TBNK3DyBrKPXVBsJNZYCojcHMSqdJmgMydgLBafQQQ',
      price: depositAmount,
      title: 'Received',
    };

    const params = {
      TableName: 'invest',
      Key: { UserID: userId },
      UpdateExpression: 'SET tonBalance = tonBalance + :amount, transactionHistory = list_append(transactionHistory, :newTransaction)',
      ExpressionAttributeValues: {
        ':amount': depositAmount,
        ':newTransaction': [transactionItem],
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await dynamoDB.update(params).promise();
      console.log('Transaction saved:', result);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }

  return (
    <div className="friends-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      {/* Header Section */}
      <div className="flex justify-between items-center pt-4 w-full px-2">
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
        <span className="text-white font-semibold">Deposit</span>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold">Amount</p>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className="w-full border-2 border-white rounded-lg mt-2 p-2 text-white bg-transparent placeholder-white"
        />
      </div>

      <div className="mt-3">
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2 flex justify-between items-center">
          <p className="text-white text-sm">Min Deposit:</p>
          <p className="text-white text-sm">0.01 TON</p>
        </div>
      </div>

      <div className="mt-3 bg-yellow-800 p-4 border-2 border-dotted border-[gold] rounded-lg">
        <div className="text-[gold] text-center py-2">
          <p className="font-semibold">Note</p>
        </div>
        <div className="text-white text-sm mt-2">
          <p>If you send an amount less than the minimum deposit, it will not be added to your account.</p>
          <p className="mt-2">You are only allowed to send through the connected wallet. Deposits through exchanges or other wallets will not be added.</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={sendTransaction}
          disabled={buttonDisabled}
          className={`w-full max-w-xs border-2 border-transparent rounded-lg ${buttonDisabled ? 'bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]' : 'bg-blue-500 text-white'} py-3 px-4 font-semibold text-lg`}
        >
          Generate Transaction
        </button>
      </div>
      <NavigationBar />
    </div>
  );
}

export default Deposit;
