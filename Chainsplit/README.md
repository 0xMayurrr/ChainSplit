# ChainSplit

Decentralized expense splitting on Cronos. Deploy a group vault, track shared expenses, and settle debts on-chain.

## Setup

```bash
npm install
cp .env.template .env
# Fill in your PRIVATE_KEY in .env
```

## Compile

```bash
npm run compile
```

## Deploy

```bash
# Testnet
npm run deploy:testnet

# Mainnet
npm run deploy:mainnet
```

## Contracts

- `GroupVault.sol` — Per-group vault. Tracks members, expenses, and settlements.
- `ChainSplitFactory.sol` — Factory that deploys and indexes GroupVault instances.

## Networks

| Network         | Chain ID | RPC                          |
|-----------------|----------|------------------------------|
| Cronos Mainnet  | 25       | https://evm.cronos.org       |
| Cronos Testnet  | 338      | https://evm-t3.cronos.org    |
