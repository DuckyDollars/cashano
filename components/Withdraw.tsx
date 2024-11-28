import { useState } from 'react';
import AWS from 'aws-sdk';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isButtonEnabled = address.trim() !== '' && Number(amount) >= 3;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isButtonEnabled) return;

        setIsSubmitting(true);

        const payload = {
            walletAddress: address,
            comment: comment,
            amount: amount,
            userId: 1617526573, // Replace with dynamic user ID if necessary
        };

        try {
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
                // Show success message
                alert('Request sent successfully');

                // Update DynamoDB
                const userId = payload.userId;
                const transactionData = {
                    date: new Date().toISOString(),
                    price: payload.amount,
                    title: 'all time',
                };

                await dynamoDB
                    .update({
                        TableName: 'invest',
                        Key: { UserID: userId },
                        UpdateExpression: 'SET transactionHistory = list_append(if_not_exists(transactionHistory, :emptyList), :newTransaction)',
                        ExpressionAttributeValues: {
                            ':emptyList': [],
                            ':newTransaction': [transactionData],
                        },
                    })
                    .promise();

                alert('Data saved to DynamoDB');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error sending data:', error);
            alert('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="friends-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1">
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

            {/* Submit Button */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleSubmit}
                    className={`w-full max-w-xs border-2 border-transparent rounded-lg py-3 px-4 font-semibold text-lg ${
                        isButtonEnabled
                            ? 'bg-blue-500 text-white'
                            : 'bg-[rgba(109,109,109,0.4)] text-[rgb(170,170,170)]'
                    }`}
                    disabled={isSubmitting || !isButtonEnabled}
                >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
            </div>
        </div>
    );
};

export default Withdraw;
