import { useEffect, useState } from "react";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import WebApp from "@twa-dev/sdk";
import Image from "next/image";
import { crypto } from "@/images"; // Assuming the image is in your images folder

const dynamoDBClient = new DynamoDBClient({
  region: "eu-north-1", // Set your DynamoDB region
  credentials: {
    accessKeyId: "AKIAUJ3VUKANTQKUIAXV",
    secretAccessKey: "X8fTA+HvyfDLk0m3+u32gtcOyWe+yiJJZ0GegssZ",
  },
});

interface UserData {
  id: number;
}

const FriendsTab = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tonBalance, setTonBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonShake, setButtonShake] = useState<boolean>(false);

  // Fetch user data from WebApp
  useEffect(() => {
    if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  // Fetch wallet address and balance from DynamoDB
  useEffect(() => {
    if (userData?.id) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setWalletAddress(null); // Reset wallet address before fetching

        try {
          const params = {
            TableName: "invest", // DynamoDB table name
            KeyConditionExpression: "UserID = :userID",
            ExpressionAttributeValues: {
              ":userID": { S: userData.id.toString() },
            },
          };

          const { Items } = await dynamoDBClient.send(new QueryCommand(params));

          if (Items && Items.length > 0) {
            const wallet = Items[0].WalletAddress.S;
            const balance = parseFloat(Items[0].tonBalance.N || "0");
            // Format wallet address only if it exists
            if (wallet) {
              setWalletAddress(`${wallet.slice(0, 12)}....${wallet.slice(-12)}`);
            }
            setTonBalance(balance);
          } else {
            setWalletAddress("Connect wallet first");
          }
        } catch (error) {
          console.error("Error accessing DynamoDB:", error);
          setError("Error accessing DynamoDB. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userData]);

  // Handle input amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleGenerateTransaction = async () => {
    if (amount < 10000) {
      setButtonShake(true);
      navigator.vibrate(500); // Vibration on invalid amount
      setTimeout(() => setButtonShake(false), 300);
      return;
    }
  
    if (tonBalance >= amount) {
      try {
        setLoading(true);
        setError(null);
  
        // Prepare updateParams
        const updateParams = {
          TableName: "invest", // DynamoDB table name
          Key: {
            UserID: { S: userData?.id.toString() || "" }, // Ensure UserID is a string (S)
          },
          UpdateExpression:
            "SET tonBalance = :newBalance, monthlyInvest = list_append(monthlyInvest, :newInvestment)", // Update the tonBalance and append the new investment
          ExpressionAttributeValues: {
            ":newBalance": { N: (tonBalance - amount).toString() }, // New tonBalance (ensure it's a number in string format)
            ":newInvestment": [
              {
                M: {
                  date: { S: new Date().toISOString() }, // Store the current date (ISO string format)
                  amount: { N: amount.toString() }, // Store the amount (ensure it's a number in string format)
                },
              },
            ], // Append to the list of monthly investments
          },
          ReturnValues: "UPDATED_NEW", // Return the updated values
        };
  
        // Log the parameters to check their structure
        console.log("DynamoDB updateParams:", JSON.stringify(updateParams, null, 2));

  
        // Update local state with new balance
        setTonBalance(tonBalance - amount);
      } catch (error) {
        console.error("Error updating DynamoDB:", error);
        setError("Error processing transaction. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Insufficient balance");
    }
  };
  
  
  

  return (
    <div className="friends-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
      {/* Header Section */}
      <div className="flex justify-between items-center pt-4 w-full px-2">
        {/* Left Icon with Text */}
        <div className="flex items-center space-x-2">
          <Image src={crypto} alt="" width={32} height={32} className="rounded-full" />
          <span className="text-white font-semibold">Crypto</span>
        </div>
        {/* Right Text */}
        <span className="text-white font-semibold">Investment</span>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold">Your wallet</p>
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2">
          {loading ? (
            <p className="text-white text-sm">Loading...</p>
          ) : error ? (
            <p className="text-white text-sm">{error}</p>
          ) : walletAddress ? (
            <p className="text-white text-sm">{walletAddress}</p>
          ) : (
            <p className="text-white text-sm">Connect wallet first</p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold">Amount</p>
        <div className="w-full border-2 border-white rounded-lg mt-2 p-2">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full text-white text-sm bg-transparent outline-none"
            placeholder="Enter amount"
            inputMode="numeric"
          />
        </div>
      </div>

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
          <p>If you send an amount less than the minimum deposit, It will not be added to your account.</p>
          <p className="mt-2">
            You are only allowed to send through the connected wallet. If you send from other wallets or make deposit through
            exchanges, the funds will not be added to your account.
          </p>
        </div>
      </div>

      {/* Button below the Note Section */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleGenerateTransaction}
          className={`w-full max-w-xs border-2 border-transparent rounded-lg ${
            amount >= 10000
              ? "bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]"
              : "bg-gray-400 text-gray-600"
          } py-3 px-4 font-semibold text-lg ${buttonShake ? "shake" : ""}`}
          disabled={amount < 10000}
        >
          Generate Transaction
        </button>
      </div>
    </div>
  );
};

export default FriendsTab;
