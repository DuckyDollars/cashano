'use client';

import { useEffect, useState } from 'react';
import { DynamoDBClient, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { crypto } from '@/images';
import Image from 'next/image';
import WebApp from '@twa-dev/sdk';

// DynamoDB Client Setup
const dynamoDBClient = new DynamoDBClient({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
    secretAccessKey: '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',
  },
});

const FriendsTab = () => {
  const [userData, setUserData] = useState<{ id: number } | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | string>('');
  const [tonBalance, setTonBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonShake, setButtonShake] = useState(false);

  useEffect(() => {
    // Ensure the code runs only in the client-side environment
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      // Set user data in state
      setUserData(WebApp.initDataUnsafe.user as { id: number });
    }
  }, []);

  // Fetch Wallet Address and Ton Balance
  useEffect(() => {
    if (userData?.id) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setWalletAddress(null); // Reset wallet address before fetching
        setTonBalance(null); // Reset tonBalance before fetching

        try {
          const params = {
            TableName: 'invest',
            KeyConditionExpression: 'UserID = :userID',
            ExpressionAttributeValues: {
              ':userID': { S: userData.id.toString() },
            },
          };

          const { Items } = await dynamoDBClient.send(new QueryCommand(params));

          if (Items && Items.length > 0) {
            const wallet = Items[0].WalletAddress?.S;
            const balance = Items[0].tonBalance?.N;
            setWalletAddress(wallet ? `${wallet.slice(0, 12)}....${wallet.slice(-12)}` : 'Connect wallet first');
            setTonBalance(balance ? parseFloat(balance) : 0);
          } else {
            setWalletAddress('Connect wallet first');
          }
        } catch (error) {
          console.error('Error accessing DynamoDB:', error);
          setError('Error accessing DynamoDB. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userData]);

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTransaction = async () => {
    if (typeof amount === 'number' && tonBalance !== null) {
      if (amount > tonBalance) {
        // Trigger shake animation if the amount is higher than the tonBalance
        setButtonShake(true);
        setTimeout(() => setButtonShake(false), 500); // Reset shake after 500ms
        if (navigator.vibrate) navigator.vibrate(200); // Vibrate if supported
        return;
      }
  
      // Proceed with the transaction if the amount is valid
      try {
        setLoading(true); // Set loading state to true when starting the transaction
  
        if (!userData?.id) {
          console.error('User ID is not defined.');
          setLoading(false); // Ensure loading state is reset on error
          return;
        }
  
        const updateParams = {
          TableName: 'invest',
          Key: {
            UserID: { S: userData.id.toString() },
          },
          UpdateExpression: 'SET tonBalance = tonBalance - :amount, monthlyInvest = list_append(monthlyInvest, :newInvest)',
          ExpressionAttributeValues: {
            ':amount': { N: amount.toString() },
            ':newInvest': {
              L: [
                {
                  M: {
                    date: { S: new Date().toISOString() },
                    amount: { N: amount.toString() },
                  },
                },
              ],
            },
          },
        };
  
        await dynamoDBClient.send(new UpdateItemCommand(updateParams));
        setTonBalance((prevBalance) => (prevBalance || 0) - amount); // Update local balance
      } catch (error) {
        console.error('Error processing transaction:', error);
      } finally {
        setLoading(false); // Reset loading state after the transaction completes or fails
      }
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
          {loading ? (
            <p className="text-white text-sm">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <p className="text-white text-sm">{walletAddress}</p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold">Amount</p>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="w-full border-2 border-white rounded-lg mt-2 p-2 text-black text-sm" 
          placeholder="Enter amount"
          min={1}
        />
      </div>

      <div className="mt-3">
                <div className="w-full border-2 border-white rounded-lg mt-2 p-2 flex justify-between items-center">
                    <p className="text-white text-sm">Min Deposit:</p>
                    <p className="text-white text-sm">0.01 TON</p>
                </div>
            </div>

      <div className="mt-4 flex justify-center">
      <button
  onClick={handleTransaction}
  className={`w-full max-w-xs border-2 border-transparent rounded-lg ${
    parseFloat(amount.toString()) >= 10000 ? 'bg-blue-500' : 'bg-[rgba(109,109,109,0.4)]'
  } text-[rgb(170,170,170)] py-3 px-4 font-semibold text-lg ${buttonShake ? 'animate-shake' : ''}`}
  disabled={parseFloat(amount.toString()) < 10000 || loading} // Disable button while loading
>
  {loading ? 'Loading...' : 'Generate Transaction'}
</button>

      </div>

      <div className="mt-3 bg-yellow-800 p-4 border-2 border-dotted border-[gold] rounded-lg">
        <div className="text-[gold] text-center py-2">
          <p className="font-semibold">Note</p>
        </div>
        <div className="text-white text-sm mt-2">
          <p>If you send an amount less than the minimum deposit, It will not be added to your account.</p>
          <p className="mt-2">You are only allowed to send through the connected wallet. If you send from other wallets or make deposit through exchanges, the funds will not be added to your account.</p>
        </div>
      </div>
    </div>
  );
};

export default FriendsTab;
