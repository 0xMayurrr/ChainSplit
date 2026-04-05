import { ethers } from "ethers";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadAbi(name: string) {
  const path = resolve(__dirname, `../../../artifacts/contracts/${name}.sol/${name}.json`);
  return JSON.parse(readFileSync(path, "utf8")).abi;
}

const NETWORK = process.env.NETWORK ?? "testnet";

const RPC_URL = NETWORK === "mainnet"
  ? (process.env.CRONOS_RPC_URL        ?? "https://evm.cronos.org")
  : (process.env.CRONOS_TESTNET_RPC_URL ?? "https://evm-t3.cronos.org");

const FACTORY_ADDRESS = NETWORK === "mainnet"
  ? process.env.FACTORY_ADDRESS_MAINNET
  : process.env.FACTORY_ADDRESS;

const provider = new ethers.JsonRpcProvider(RPC_URL);

export function getFactory() {
  if (!FACTORY_ADDRESS) throw new Error(`FACTORY_ADDRESS not set for network: ${NETWORK}`);
  return new ethers.Contract(FACTORY_ADDRESS, loadAbi("ChainSplitFactory"), provider);
}

export function getVault(address: string) {
  return new ethers.Contract(address, loadAbi("GroupVault"), provider);
}

export { provider };
