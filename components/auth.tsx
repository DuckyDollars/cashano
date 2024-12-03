import React from 'react';
import { QR } from '@/images';
import Image from 'next/image';

function AUTH() {
  return (
    <div className="friends-tab-con transition-all duration-300 flex justify-center items-center h-screen flex-col bg-black px-1">
      <h1 className="text-white text-[35px]">Play On Mobile</h1>
      <Image 
      src={QR}
      alt=""
      className='h-[250px] w-[250px] mt-4'
      />
    </div>
  );
}

export default AUTH;
