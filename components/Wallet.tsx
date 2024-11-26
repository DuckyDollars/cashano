import React from 'react'
import Uparrow from '@/icons/Uparrow';
import Link from 'next/link'
import DownArrow from '@/icons/Darrow';
import Image from 'next/image';
import { TonCoin } from '@/images';
import { TonConnectButton } from '@tonconnect/ui-react';

function Wallet() {
  return (
    <div className="home-tab-con transition-all duration-300 flex items-center justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500">
            
    {/* Wallet Connection Button */}
    <TonConnectButton 
        className="bg-transparent text-black w-[35%] py-1 mt-5 rounded-lg"
    >
    </TonConnectButton>
    
    <div className="text-white text-4xl mt-4">
        0.00Ton
    </div>

    {/* Container for Deposit and Withdraw Circles */}
    <div className="flex justify-between w-[35%] mt-8">

        <Link href="/deposit" className="flex flex-col items-center justify-center">
            <div className="bg-green-900 w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <DownArrow className="w-8 h-8" />
            </div>
            <span className="text-white text-sm mt-2">Deposit</span>
        </Link>
        
        {/* Withdraw Circle */}
        <div className="flex flex-col items-center justify-center">
            <div className="bg-green-900 w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <Uparrow className="w-8 h-8" />
            </div>
            <span className="text-white text-sm mt-2">Withdraw</span>
        </div>
    </div>
    
    
    <div className="w-[98%] bg-[green] border-[2px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between mt-8">
        <div className="flex items-center gap-3 font-medium">
            <Image 
                src={TonCoin}
                alt='ton'
                className="w-9 h-9" />
            <span className='text-white'>TONCOIN</span>
        </div>
        <p className='text-white'>0.00</p>
    </div>
</div>
  )
}

export default Wallet