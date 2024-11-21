'use client'

import NavigationBar from '@/components/NavigationBar'
import MintSBT from "@/components/Wallet";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const MANIFEST_URL = 'https://gateway.pinata.cloud/ipfs/QmZd2pBynX8ieaBJHuEhkMQD9fCvCboKJsbEbpVJ7TLAEr';

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <MintSBT />
      <NavigationBar />
    </TonConnectUIProvider>
  );
}
