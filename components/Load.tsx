import React from 'react';
import { logo } from '@/images';
import Image from 'next/image';

function Load() {
  return (
    <div
      className="friends-tab-con transition-all duration-300 flex justify-center items-center h-screen flex-col bg-green-500 px-1"
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #38b2ac, #2c7a7b)',
      }}
    >
      {/* Static Image with Spinning Border */}
      <div
        style={{
          width: '220px',
          height: '220px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            width: '200px',
            height: '200px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={logo}
            alt="Logo"
            style={{
              borderRadius: '50%',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
      {/* Loading Text */}
      <h1
        style={{
          color: 'white',
          fontSize: '35px',
          marginTop: '16px',
          animation: 'fade 1.5s ease-out infinite',
        }}
      >
        Loading...
      </h1>
      {/* Keyframe Animations */}
      <style jsx>{`

        @keyframes fade {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Load;
