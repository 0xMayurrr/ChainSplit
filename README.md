<p align="center">
  <img src="YOUR_LOGO_URL" alt="ChainSplit" width="96" height="96" />
</p>

<h1 align="center">ChainSplit</h1>

<p align="center">
  Decentralized expense splitting on Cronos. No middlemen. No trust issues. Just code.
</p>

<p align="center">
  <a href="https://chain-split.vercel.app">chain-split.vercel.app</a> &nbsp;·&nbsp;
  <a href="https://github.com/0xMayurrr/ChainSplit">GitHub</a> &nbsp;·&nbsp;
  <a href="#getting-started">Setup</a>
</p>

---

You've split bills on Splitwise. You've chased friends for money on Venmo. You've trusted some company's database to keep track of who owes what.

ChainSplit puts all of that on-chain. Each group deploys its own smart contract vault on **Cronos EVM**. Members log expenses, the contract calculates settlements using a greedy debt-minimization algorithm, and everyone settles peer-to-peer — no platform in the middle, no accounts, no trust required.

---

## Deployments

| Service | URL |
|---------|-----|
| Frontend | [chain-split.vercel.app](https://chain-split.vercel.app) |
| Backend API | [chainsplit-389w.onrender.com](https://chainsplit-389w.onrender.com) |
| Database | MongoDB Atlas |
| File Storage | Pinata (IPFS) |

**Factory Contract — Cronos Testnet (`338`)**
```
0xe9256300bb409b5Cf8CF16aDD6A0aDB0cc72E5bf
```

> Get testnet CRO → [cronos.org/faucet](https://cronos.org/faucet)

---

## How it works

```
1.  A group admin calls createGroup()
    → Factory deploys a fresh GroupVault contract

2.  Admin invites members via addMember(address, name)

3.  Members deposit CRO into the vault

4.  Anyone logs an expense:
    addExpenseEqual()   →  split evenly across members
    addExpenseCustom()  →  assign custom weights per person

5.  calculateSettlements() runs a greedy algorithm
    → returns the minimum set of transactions to clear all debts

6.  Each debtor calls settleDebt(creditor)
    → CRO transfers directly, 1% protocol fee applied

7.  Admin calls markGroupSettled() to close the vault
```

No off-chain matching. No central server holding funds. The contract is the arbiter.

---

## Contracts

### `ChainSplitFactory.sol`

Entry point. Deploys a `GroupVault` per group and maintains a global registry.

```solidity
function createGroup(
    string memory _name,
    string memory _emoji,
    string memory _adminName
) external returns (address vault);
```

---

### `GroupVault.sol`

One contract per group. Owns all logic — membership, expenses, net balance computation, fund flows.

```solidity
addMember(address, name)       // Admin: add a wallet to the group
deposit()                      // Member: deposit CRO into vault
addExpenseEqual(...)           // Member: log an equal-split expense
addExpenseCustom(...)          // Member: log a weighted expense
calculateSettlements()         // Public: returns optimal settlement paths
settleDebt(address creditor)   // Member: pay a creditor (1% fee)
markGroupSettled()             // Admin: lock the group
withdrawRemaining()            // Admin: reclaim leftover balance
```

**Security**
- Custom `nonReentrant` guard on all ETH-transfer functions
- `onlyAdmin` / `onlyMember` / `notSettled` access modifiers
- No external contract calls — zero attack surface from dependencies

---

## Stack

**Smart Contracts** — Solidity `0.8.24`, Hardhat, deployed on Cronos EVM

**Frontend** — Vite + React 18 + TypeScript, TailwindCSS, wagmi v2, RainbowKit, viem

**Backend** — Express + TypeScript, Mongoose, ethers.js v6, Pinata SDK, express-rate-limit

**Infrastructure** — Vercel (frontend), Render (backend), MongoDB Atlas, Pinata IPFS

---

## Project Structure

```
ChainSplit/
├── contracts/
│   ├── ChainSplitFactory.sol
│   └── GroupVault.sol
│
├── frontend/
│   └── src/
│       ├── pages/          # Dashboard, Groups, Activity, Profile
│       ├── hooks/          # Custom wagmi hooks
│       ├── abis/           # Contract ABIs + addresses
│       └── config/         # wagmi / RainbowKit config
│
└── backend/
    └── src/
        ├── routes/         # /groups, /expenses, /users
        ├── models/         # Mongoose schemas
        └── services/       # Chain indexer, IPFS service
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask (or any Cronos-compatible wallet)
- MongoDB Atlas URI
- Pinata credentials
- WalletConnect v2 Project ID

### Install & run

```bash
# Clone
git clone https://github.com/0xMayurrr/ChainSplit.git
cd ChainSplit

# Contracts
npm install
npm run compile
cp .env.example .env        # Add PRIVATE_KEY + CRONOS_TESTNET_RPC_URL
npm run deploy:testnet

# Backend
cd backend
cp .env.template .env       # Add MONGODB_URI, PINATA_*, FACTORY_ADDRESS
npm install && npm run dev   # → localhost:3000

# Frontend
cd frontend
cp .env.example .env        # Add VITE_FACTORY_ADDRESS, VITE_WALLETCONNECT_PROJECT_ID
npm install && npm run dev   # → localhost:5173
```

### Environment Variables

**Frontend**

| Key | Description |
|-----|-------------|
| `VITE_FACTORY_ADDRESS` | Factory contract on testnet |
| `VITE_FACTORY_ADDRESS_MAINNET` | Factory contract on mainnet |
| `VITE_WALLETCONNECT_PROJECT_ID` | From cloud.walletconnect.com |
| `VITE_NETWORK` | `testnet` or `mainnet` |
| `VITE_API_URL` | Backend base URL |

**Backend**

| Key | Description |
|-----|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `FACTORY_ADDRESS` | Testnet factory address |
| `CRONOS_TESTNET_RPC_URL` | Cronos testnet RPC |
| `PINATA_API_KEY` | Pinata API key |
| `PINATA_JWT` | Pinata JWT (recommended) |
| `FRONTEND_URL` | CORS allowed origin |

---

## Contributing

```bash
git checkout -b feat/your-feature
git commit -m "feat: describe your change"
git push origin feat/your-feature
# open a PR
```

---

## License

MIT — see [LICENSE](LICENSE)

---

<p align="center">
  Built by <a href="https://github.com/0xMayurrr">0xMayur</a> &nbsp;·&nbsp; Cronos EVM &nbsp;·&nbsp; Solidity
</p>
