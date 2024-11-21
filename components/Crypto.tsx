'use client'

import React, { useState, useEffect } from 'react';
import { crypto } from '@/images';
import Image from 'next/image';
import AWS from 'aws-sdk';
import WebApp from '@twa-dev/sdk';

// Initialize DynamoDB client with necessary credentials
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
  secretAccessKey: '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'
});

interface UserData {
  id: number;
}

const FriendsTab = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [amount, setAmount] = useState<number | string>('');
  const [tonBalance, setTonBalance] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);

  useEffect(() => {
    // Ensure the code runs only in the client-side environment
    if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  useEffect(() => {
    // Fetch wallet address and TON balance when user data is available
    if (userData) {
      const fetchData = async () => {
        const wallet = await getWalletAddress(userData.id);
        setWalletAddress(wallet);

        // Fetch TON balance from DynamoDB
        const balance = await getTonBalance(userData.id);
        setTonBalance(balance);
      };
      fetchData();
    }
  }, [userData]);

  // Fetch wallet address from DynamoDB
  const getWalletAddress = async (userId: number) => {
    const params = {
      TableName: 'PandaPals',
      Key: { UserID: userId },
    };

    try {
      const result = await dynamoDb.get(params).promise();
      return result.Item ? result.Item.walletAddress : 'No address found';
    } catch (error) {
      console.error('Error fetching wallet address:', error);
      return 'Error fetching address';
    }
  };

  // Fetch TON balance from DynamoDB
  const getTonBalance = async (userId: number) => {
    const params = {
      TableName: 'PandaPals',
      Key: { UserID: userId },
    };

    try {
      const result = await dynamoDb.get(params).promise();
      return result.Item ? result.Item.TonBalance : 0;
    } catch (error) {
      console.error('Error fetching TON balance:', error);
      return 0;
    }
  };

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    // Enable button if amount is 250 or higher
    if (Number(value) >= 250) {
      setIsButtonEnabled(true);
      setErrorMessage('');
    } else {
      setIsButtonEnabled(false);
      setErrorMessage('Minimum Invest = 250');
    }
  };

  // Handle "Generate Transaction" click
  const handleGenerateTransaction = async () => {
    if (Number(amount) < 250) {
      setErrorMessage('Minimum Invest = 250');
      return;
    }

    // Check if the user has sufficient balance
    if (tonBalance < Number(amount)) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setErrorMessage('Insufficient balance');
      return;
    }

    // Show confirmation popup
    setShowConfirmationPopup(true);
  };

  // Handle confirmation action
  const handleConfirmTransaction = async () => {
    // Proceed with the transaction logic (e.g., save data to DynamoDB)
    const transactionData = {
      TableName: 'PandaPals',
      Key: { UserID: userData!.id },
      UpdateExpression: 'SET monthlyInvest = list_append(monthlyInvest, :newInvest)',
      ExpressionAttributeValues: {
        ':newInvest': [{ date: new Date().toISOString(), amount }],
      },
    };

    try {
      await dynamoDb.update(transactionData).promise();
      setShowConfirmationPopup(false);
      setErrorMessage('Transaction successful!');
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrorMessage('Error occurred, please try again');
    }
  };

  // Handle cancel action on the confirmation popup
  const handleCancelTransaction = () => {
    setShowConfirmationPopup(false);
  };

  return (
    <div className="friends-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      {/* Header Section */}
      <div className="flex justify-between items-center pt-4 w-full px-2">
        {/* Left Icon with Text */}
        <div className="flex items-center space-x-2">
          <Image
            src={crypto}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-white font-semibold">Crypto</span>
        </div>

        {/* Right Text */}
        <span className="text-white font-semibold">Investment</span>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold">Your wallet</p>
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2">
          <p className="text-white text-sm">{walletAddress || 'Loading address...'}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-white font-semibold">Amount</p>
        <input
          type="number"
          className="w-full border-2 border-white rounded-lg mt-2 p-2 text-sm text-black"
          placeholder="Enter amount"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}

      <div className="mt-3">
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2 flex justify-between items-center">
          <p className="text-white text-sm">Min Deposit:</p>
          <p className="text-white text-sm">0.01 TON</p>
        </div>
      </div>

      <div className="mt-3 bg-yellow-800 p-4 border-2 border-dotted border-[gold] rounded-lg">
        <div className=" text-[gold] text-center py-2">
          <p className="font-semibold">Note</p>
        </div>
        <div className="text-white text-sm mt-2">
          <p>If you send an amount less than the minimum deposit, it will not be added to your account.</p>
          <p className="mt-2">You are only allowed to send through the connected wallet. If you send from other wallets or make a deposit through exchanges, the funds will not be added to your account.</p>
        </div>
      </div>

      {/* Button to Generate Transaction */}
      <div className="mt-4 flex justify-center">
        <button
          className={`w-full max-w-xs border-2 border-transparent rounded-lg ${isButtonEnabled ? 'bg-blue-500' : 'bg-[rgba(109,109,109,0.4)]'} text-white py-3 px-4 font-semibold text-lg ${isShaking ? 'animate-shake' : ''}`}
          onClick={handleGenerateTransaction}
          disabled={!isButtonEnabled}
        >
          Generate Transaction
        </button>
      </div>

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
            <h3 className="text-xl font-semibold text-center mb-4">Confirm Transaction</h3>
            <p className="text-center text-lg">Are you sure you want to invest {amount} TON?</p>
            <div className="flex justify-between mt-4">
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg" onClick={handleCancelTransaction}>Cancel</button>
              <button className="bg-green-500 text-white py-2 px-4 rounded-lg" onClick={handleConfirmTransaction}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsTab;
