"use client";

import React, { useState, useEffect } from 'react';
import { TonCoin } from '../images';
import Image from 'next/image';
import { useTonConnectUI } from "@tonconnect/ui-react";

function Deposit() {
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = useState(''); // State to hold the user input
  const [buttonDisabled, setButtonDisabled] = useState(true); // To track if the button is disabled
  const [walletAddress, setWalletAddress] = useState(null); // State to hold the wallet address

  // Fetch wallet address from local storage when the component mounts
  useEffect(() => {
    const address = localStorage.getItem('walletAddress');
    if (address) {
      setWalletAddress(address);
    } else {
      setWalletAddress(null); // No wallet address available
    }
  }, []);

  // Function to format the wallet address
  const formatWalletAddress = (address) => {
    if (!address) return "Loading...";

    const first12 = address.slice(0, 8);
    const last12 = address.slice(-8);
    return `${first12}...${last12}`;
  };

  // Handle amount input change
  function handleAmountChange(event) {
    const value = event.target.value;
    setAmount(value);
    
    // Enable button only if the amount is a valid number greater than 0
    setButtonDisabled(!(value && !isNaN(value) && Number(value) > 0));
  }

  // Function to connect wallet if not connected
  async function connectWallet() {
    await tonConnectUI.openModal();
  }

  // Function to send a transaction
  async function sendTransaction() {
    // Check for required data in local storage
    const requiredKeys = [
      'ton-connect-ui_wallet-info',
      'ton-connect-ui_preferred-wallet',
      'ton-connect-ui_last-selected-wallet-info',
      'ton-connect-storage_bridge-connection',
    ];

    // If any key is missing, prompt the user to connect the wallet
    const missingData = requiredKeys.some(key => !localStorage.getItem(key));

    if (missingData) {
      // Call the connectWallet function if data is missing
      await connectWallet();
      return; // Early return to stop the transaction process
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      console.error("Invalid amount");
      return; // Early return if amount is invalid
    }

    const transaction = {
      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
      messages: [
        {
          address: "0QDOV1efOQu-ZbT2JR5TSfuVLerbMQE9dm_ngNNBCirI0SQz",
          amount: (Number(amount) * 1000000000).toString(), // Convert the amount to nanotons
        },
      ],
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      console.log(`Successfully sent ${amount} TON`);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

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
        <span className="text-white font-semibold">Investment</span>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold">Your wallet</p>
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2">
          <p className="text-white text-sm">{formatWalletAddress(walletAddress)}</p>
        </div>
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

      {/* New Section under Min Deposit */}
      <div className="mt-3 bg-yellow-800 p-4 border-2 border-dotted border-[gold] rounded-lg">
        <div className="text-[gold] text-center py-2">
          <p className="font-semibold">Note</p>
        </div>
        <div className="text-white text-sm mt-2">
          <p>If you send an amount less than the minimum deposit, it will not be added to your account.</p>
          <p className="mt-2">You are only allowed to send through the connected wallet. If you send from other wallets or make deposits through exchanges, the funds will not be added to your account.</p>
        </div>
      </div>

      {/* Button below the Note Section */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={sendTransaction}
          disabled={buttonDisabled}
          className={`w-full max-w-xs border-2 border-transparent rounded-lg ${buttonDisabled ? 'bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]' : 'bg-blue-500 text-white'} py-3 px-4 font-semibold text-lg`}
        >
          Generate Transaction
        </button>
      </div>
    </div>
  );
}

export default Deposit;
