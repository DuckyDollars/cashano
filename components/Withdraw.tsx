'use client'

import { useState } from 'react'
import { TonCoin } from '@/images'
import Image from 'next/image'
import WebApp from '@twa-dev/sdk'

const FriendsTab = () => {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [comment, setComment] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // Fetching the user data (userId)
    const [userData, setUserData] = useState<{ id: number } | null>(null);

    if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
        const user = WebApp.initDataUnsafe.user as { id: number };
        setUserData(user);
    }

    // Enable button only if address is filled and amount >= 3
    const validateButton = () => {
        if (address.trim() !== '' && Number(amount) >= 3) {
            setIsButtonEnabled(true);
        } else {
            setIsButtonEnabled(false);
        }
    };

    // Handle form submission to send email
    const handleSubmit = async () => {
        if (!userData) {
            alert('User data is unavailable');
            return;
        }

        const { id: userId } = userData;
        
        const emailBody = `
            Wallet Address = ${address}
            Comment = ${comment}
            Amount = ${amount}
            User ID = ${userId}
        `;

        const emailData = {
            to: 'cashcrazee1@gmail.com',
            subject: 'Withdrawal Request',
            body: emailBody,
        };

        // Here you would send the email via your backend or email API
        // For example, using fetch or an email sending service like SendGrid
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (response.ok) {
                alert('Request sent successfully!');
            } else {
                alert('Failed to send request.');
            }
        } catch (error) {
            alert('An error occurred while sending the request.');
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
                        alt=""
                        width={32}
                        height={32}
                        className='rounded-full'
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
                    onChange={(e) => {
                        setAddress(e.target.value);
                        validateButton();
                    }}
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
                    onChange={(e) => {
                        setAmount(e.target.value);
                        validateButton();
                    }}
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

            {/* Button */}
            <div className="mt-4 flex justify-center">
                <button
                    className={`w-full max-w-xs border-2 border-transparent rounded-lg py-3 px-4 font-semibold text-lg ${
                        isButtonEnabled
                            ? 'bg-blue-500 text-white'
                            : 'bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]'
                    }`}
                    disabled={!isButtonEnabled}
                    onClick={handleSubmit} // Trigger email sending when button is clicked
                >
                    Send Request
                </button>
            </div>
        </div>
    )
}

export default FriendsTab
