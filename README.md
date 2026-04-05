<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:002D74,50:0052CC,100:00A3FF&height=200&section=header&text=⛓️%20ChainSplit&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=Decentralized%20Expense%20Splitting%20on%20Cronos&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<br/>

[![Built on Cronos](https://img.shields.io/badge/Built%20on-Cronos-002D74?style=for-the-badge&logo=ethereum&logoColor=white)](https://cronos.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![wagmi](https://img.shields.io/badge/wagmi-v2-1C1C1E?style=for-the-badge&logo=ethereum&logoColor=white)](https://wagmi.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

> **Split bills. Settle debts. On-chain. Trustlessly.**  
> ChainSplit brings group expense management to the blockchain — no middlemen, no trust issues, just code.

<br/>

[🚀 **Live Demo**](https://chainsplit.vercel.app) &nbsp;·&nbsp; [📄 **Smart Contracts**](#-smart-contracts) &nbsp;·&nbsp; [🛠️ **Setup Guide**](#-getting-started) &nbsp;·&nbsp; [🏗️ **Architecture**](#️-architecture)

<br/>

</div>

---

## 🧩 What is ChainSplit?

Going on a trip with friends? Splitting rent? Shared subscriptions? ChainSplit handles it all — **on-chain**.

Each group deploys its own smart contract vault on the **Cronos EVM**. Members deposit funds, log expenses, and the contract automatically computes who owes what using a **greedy debt-minimization algorithm**. Settle debts peer-to-peer with a single transaction. No spreadsheets. No Venmo. No arguments.

```
User A pays dinner ($100)  →  ChainSplit logs it on-chain
                            →  Calculates: B owes $33, C owes $33
                            →  B & C call settleDebt() to pay trustlessly
                            →  Group marked ✅ Settled
```

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🏦 **Group Vaults** | Every group gets its own deployed smart contract — isolated, non-custodial |
| 💸 **Equal & Custom Splits** | Split equally or assign custom weight per member |
| 🤝 **On-Chain Settlement** | Trustless `settleDebt()` with a transparent 1% protocol fee |
| 📊 **Greedy Debt Minimization** | Smart contract minimizes total number of settlement transactions |
| 🔐 **Reentrancy Protected** | Custom `nonReentrant` modifier on all fund-transfer functions |
| 🌐 **Live Activity Feed** | Real-time timeline with category filters (Expenses · Settlements · Payments) |
| 🔗 **WalletConnect v2** | MetaMask, Rainbow, Coinbase Wallet — all via RainbowKit |
| 📁 **IPFS Metadata** | Group avatars & metadata pinned to Pinata — decentralized by default |
| 📱 **Mobile-First UI** | Bottom nav on mobile, sidebar on desktop — fully responsive |
| 🗄️ **Off-Chain Indexer** | Express + MongoDB backend indexes on-chain events for fast reads |

---

## 🏗️ Architecture

```
ChainSplit/
│
├── 📦 contracts/                   # Hardhat project — Solidity smart contracts
│   ├── ChainSplitFactory.sol       # Factory: deploys & indexes GroupVaults
│   └── GroupVault.sol              # Per-group vault — full expense + settlement logic
│
├── 🖥️  frontend/                   # Vite + React 18 + TypeScript dApp
│   └── src/
│       ├── pages/                  # Dashboard · Groups · Activity · Profile
│       ├── components/             # Sidebar, shared UI components
│       ├── abis/                   # Contract ABIs + deployed addresses
│       ├── hooks/                  # Custom wagmi hooks (useGroupVault, etc.)
│       ├── services/               # Axios API client
│       └── config/                 # wagmi / RainbowKit chain config
│
└── ⚙️  backend/                    # Express + TypeScript REST API
    └── src/
        ├── routes/                 # /groups · /expenses · /users
        ├── models/                 # Mongoose schemas (MongoDB Atlas)
        ├── services/               # Blockchain indexer · IPFS service
        └── middleware/             # Rate limiting · Input validation
```

### How it all fits together

```
Browser (React/wagmi)
    │
    ├── writes  ──────────────────► Cronos EVM (GroupVault.sol)
    │                                   │
    │                                   └── Events emitted ──► Backend Indexer
    │                                                               │
    └── reads  ◄──────────────────── Express REST API ◄────────────┘
                                     (MongoDB cache)
```

---

## 🔐 Smart Contracts

### `ChainSplitFactory.sol`

The single entry point. Deploys a fresh `GroupVault` per group and maintains a global registry of all vaults.

```solidity
function createGroup(
    string memory _name,
    string memory _emoji,
    string memory _adminName
) external returns (address vault);
```

**🟢 Deployed — Cronos Testnet:** `0xe9256300bb409b5Cf8CF16aDD6A0aDB0cc72E5bf`

---

### `GroupVault.sol`

The core contract. Each group gets an isolated vault that owns all logic — member management, expense tracking, balance computation, and fund settlement.

**Deployed — Cronos Testnet:** `0x7d828173126408b4fbdd3cef614698d452be5a3e`

#### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `addMember(address, name)` | Admin | Invite a wallet address to the group |
| `deposit()` | Member | Deposit CRO into the shared vault |
| `addExpenseEqual(...)` | Member | Log an equally-distributed expense |
| `addExpenseCustom(...)` | Member | Log a custom-weighted expense |
| `calculateSettlements()` | Public | Returns optimal settlement paths (greedy algo) |
| `settleDebt(address)` | Member | Pay a creditor directly — 1% protocol fee applied |
| `markGroupSettled()` | Admin | Lock the group once all debts are cleared |
| `withdrawRemaining()` | Admin | Reclaim leftover vault balance post-settlement |

#### Security Model

```
✅ Custom nonReentrant modifier    — Guards all ETH-transfer functions
✅ onlyAdmin modifier              — Factory-set admin controls group lifecycle
✅ onlyMember modifier             — Restricts expense/settlement to participants
✅ notSettled modifier             — Prevents actions on finalized groups
✅ No external dependencies        — Zero upgradeable proxies, zero external calls
```

---

## 🖥️ Frontend

Built with **Vite + React 18 + TypeScript + TailwindCSS**, powered by **wagmi v2** and **RainbowKit** for seamless wallet UX.

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Connect wallet & introduction |
| `/dashboard` | Dashboard | Stats, groups overview, recent activity |
| `/groups` | Groups List | All groups this wallet is a member of |
| `/groups/create` | Create Group | Deploy a new GroupVault contract |
| `/groups/:address` | Group Detail | Members, expenses, settlement interface |
| `/activity` | Activity Feed | Live timeline with category filters |
| `/profile` | Profile | Settings, display name, avatar |

### Tech Stack

```
wagmi v2          →  Type-safe contract reads/writes
RainbowKit        →  Multi-wallet connection UI
viem              →  Low-level EVM utilities
React Router v6   →  Client-side routing
TailwindCSS       →  Utility-first styling + custom tokens
Pinata SDK        →  IPFS uploads (group avatars + metadata)
```

---

## ⚙️ Backend

A lightweight **Express + TypeScript** REST API for off-chain indexing, metadata caching, and IPFS integration — ensuring the frontend stays fast even with large groups.

### Endpoints

```
GET  /api/groups                     → All groups indexed from chain events
GET  /api/groups/:vault              → Group metadata + member list
GET  /api/groups/:vault/expenses     → Full expense history for a vault
POST /api/users/profile              → Update display name / avatar (IPFS pin)
```

**Stack:** Express · Mongoose · MongoDB Atlas · ethers.js v6 · Pinata IPFS · express-rate-limit

---

## 🌍 Network Info

| Network | Chain ID | RPC Endpoint |
|---------|----------|-------------|
| Cronos Mainnet | `25` | `https://evm.cronos.org` |
| Cronos Testnet | `338` | `https://evm-t3.cronos.org` |

> 💧 Need testnet CRO? Grab it from the [Cronos Testnet Faucet](https://cronos.org/faucet)

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- A Cronos-compatible wallet (MetaMask recommended)
- MongoDB Atlas URI
- Pinata API credentials (for IPFS)
- WalletConnect v2 Project ID

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/0xMayurrr/ChainSplit.git
cd ChainSplit
```

---

### Step 2 — Deploy Smart Contracts

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Set up environment
cp .env.example .env
# → Add PRIVATE_KEY and CRONOS_TESTNET_RPC_URL

# Deploy to Cronos Testnet
npm run deploy:testnet
```

---

### Step 3 — Start the Backend

```bash
cd backend
cp .env.template .env
# → Fill in MONGODB_URI, PINATA_*, FACTORY_ADDRESS, FRONTEND_URL

npm install
npm run dev     # Runs on http://localhost:3000
```

---

### Step 4 — Start the Frontend

```bash
cd frontend
cp .env.example .env
# → Set VITE_FACTORY_ADDRESS, VITE_WALLETCONNECT_PROJECT_ID, VITE_API_URL

npm install
npm run dev     # Runs on http://localhost:5173
```

Open `http://localhost:5173`, connect your wallet, and start splitting. ⚡

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_FACTORY_ADDRESS` | Deployed factory contract address (testnet) |
| `VITE_FACTORY_ADDRESS_MAINNET` | Mainnet factory address |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect v2 project ID from cloud.walletconnect.com |
| `VITE_NETWORK` | `testnet` or `mainnet` |
| `VITE_API_URL` | Your backend base URL |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `FACTORY_ADDRESS` | Cronos Testnet factory address |
| `FACTORY_ADDRESS_MAINNET` | Cronos Mainnet factory address |
| `CRONOS_TESTNET_RPC_URL` | Cronos testnet RPC endpoint |
| `PINATA_API_KEY` | Pinata API key |
| `PINATA_API_SECRET` | Pinata secret key |
| `PINATA_JWT` | Pinata JWT (preferred auth method) |
| `FRONTEND_URL` | CORS allowed origin (your Vercel deployment URL) |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

```bash
# 1. Fork this repository
# 2. Create a feature branch
git checkout -b feat/amazing-feature

# 3. Commit your changes (use conventional commits)
git commit -m 'feat: add amazing feature'

# 4. Push to your branch
git push origin feat/amazing-feature

# 5. Open a Pull Request
```

**Good first issues:** contract tests, UI polish, additional wallet support, mainnet deployment scripts.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00A3FF,50:0052CC,100:002D74&height=120&section=footer" width="100%"/>

**Built by [0xMayur](https://github.com/0xMayurrr) · Deployed on [Cronos](https://cronos.org) · Powered by Solidity**

⭐ **Star this repo** if ChainSplit helped you ship something awesome!

</div>
