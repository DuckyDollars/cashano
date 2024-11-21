'use client'

import Uparrow from '@/icons/Uparrow'
import DownArrow from '@/icons/Darrow'
import Image from 'next/image';
import { TonCoin, usdt } from '@/images';
import { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';

const Invest = () => {
    const [tonConnectUI] = useTonConnectUI();
    const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);

    const handleWalletConnection = useCallback((address: string) => {
        setTonWalletAddress(address);
        console.log("Wallet connected successfully!");
    }, []);

    const handleWalletDisconnection = useCallback(() => {
        setTonWalletAddress(null);
        console.log("Wallet disconnected successfully!");
    }, []);

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (tonConnectUI.account?.address) {
                handleWalletConnection(tonConnectUI.account?.address);
            } else {
                handleWalletDisconnection();
            }
        };

        checkWalletConnection();
        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
            if (wallet) {
                handleWalletConnection(wallet.account.address);
            } else {
                handleWalletDisconnection();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

    const handleWalletAction = async () => {
        console.log('Wallet Action Triggered');
        if (tonConnectUI.connected) {
            console.log('Disconnecting Wallet');
            await tonConnectUI.disconnect();
        } else {
            console.log('Opening Wallet Modal');
            await tonConnectUI.openModal();
        }
    };

    const formatAddress = (address: string) => {
        const tempAddress = Address.parse(address).toString();
        return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
    };

    return (
        <div className="home-tab-con transition-all duration-300 flex items-center justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500">
            
            {/* Wallet Connection Button */}
            <button 
                className="bg-white text-black w-[35%] py-1 mt-5 rounded-lg"
                onClick={handleWalletAction}
            >
                {tonWalletAddress ? `${formatAddress(tonWalletAddress)}` : 'Connect Wallet'}
            </button>
            
            <div className="text-white text-4xl mt-4">
                $0.01
            </div>

            {/* Container for Deposit and Withdraw Circles */}
            <div className="flex justify-between w-[35%] mt-8">
                {/* Deposit Circle */}
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-green-900 w-[50px] h-[50px] rounded-full flex items-center justify-center">
                        <DownArrow className="w-8 h-8" />
                    </div>
                    <span className="text-white text-sm mt-2">Deposit</span>
                </div>
                
                {/* Withdraw Circle */}
                <div className="flex flex-col items-center justify-center">
                    <div className="bg-green-900 w-[50px] h-[50px] rounded-full flex items-center justify-center">
                        <Uparrow className="w-8 h-8" />
                    </div>
                    <span className="text-white text-sm mt-2">Withdraw</span>
                </div>
            </div>
            
            {/* TONCOIN Button */}
            <button className="w-[98%] bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between mt-8">
                <div className="flex items-center gap-3 font-medium">
                    <Image 
                        src={TonCoin}
                        alt='ton'
                        className="w-9 h-9" />
                    <span className='text-white'>TONCOIN</span>
                </div>
                <p className='text-white'>0.00</p>
            </button>

            {/* USDT Button */}
            <button className="w-[98%] bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between mt-3">
                <div className="flex items-center gap-3 font-medium">
                    <Image 
                        src={usdt}
                        alt='usdt'
                        className="w-9 h-9" />
                    <span className='text-white'>Teather USD</span>
                </div>
                <p className='text-white'>0.00</p>
            </button> 
        </div>
    );
}

export default Invest;
