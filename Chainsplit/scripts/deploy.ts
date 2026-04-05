import { ethers } from "ethers";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

async function main() {
  const rpc = process.env.CRONOS_TESTNET_RPC_URL ?? "https://evm-t3.cronos.org";
  const key = process.env.PRIVATE_KEY?.trim();
  if (!key) throw new Error("PRIVATE_KEY not set in .env");

  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet   = new ethers.Wallet(key, provider);
  console.log("Deploying with account:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "CRO");
  if (balance === 0n) throw new Error("Wallet has no CRO. Get testnet CRO from https://cronos.org/faucet");

  const artifact = JSON.parse(readFileSync(resolve(__dirname, "../artifacts/contracts/ChainSplitFactory.sol/ChainSplitFactory.json"), "utf8"));
  const factory  = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\nChainSplitFactory deployed to:", address);
  console.log("\nAdd this to your .env files:");
  console.log(`FACTORY_ADDRESS=${address}`);
  console.log(`VITE_FACTORY_ADDRESS=${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
  