import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const cronosTestnet = defineChain({
  id: 338,
  name: "Cronos Testnet",
  nativeCurrency: { name: "CRO", symbol: "CRO", decimals: 18 },
  rpcUrls: { default: { http: ["https://evm-t3.cronos.org"] } },
  blockExplorers: { default: { name: "Cronos Explorer", url: "https://explorer.cronos.org/testnet" } },
  testnet: true,
});

export const cronosMainnet = defineChain({
  id: 25,
  name: "Cronos",
  nativeCurrency: { name: "CRO", symbol: "CRO", decimals: 18 },
  rpcUrls: { default: { http: ["https://evm.cronos.org"] } },
  blockExplorers: { default: { name: "Cronos Explorer", url: "https://explorer.cronos.org" } },
});

const isMainnet = import.meta.env.VITE_NETWORK === "mainnet";

export const activeChain = isMainnet ? cronosMainnet : cronosTestnet;

export const wagmiConfig = getDefaultConfig({
  appName: "ChainSplit",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: isMainnet ? [cronosMainnet, cronosTestnet] : [cronosTestnet, cronosMainnet],
});
