import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    cronos: {
      type: "http",
      url: process.env.CRONOS_RPC_URL ?? "https://evm.cronos.org",
      chainId: 25,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    cronosTestnet: {
      type: "http",
      url: process.env.CRONOS_TESTNET_RPC_URL ?? "https://evm-t3.cronos.org",
      chainId: 338,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;
