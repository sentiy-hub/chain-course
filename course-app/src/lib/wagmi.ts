// lib/wagmi.ts
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from "connectkit"

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
}

export const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: "YD教育",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  }),
);