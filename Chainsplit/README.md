<div align="center">

<img src="https://img.shields.io/badge/Built%20on-Cronos-002D74?style=for-the-badge&logo=ethereum&logoColor=white" />
<img src="https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity&logoColor=white" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

<br/><br/>

# ⛓️ ChainSplit

### *Decentralized Expense Splitting on Cronos*

**Split bills. Settle debts. On-chain. Trustlessly.**

ChainSplit is a full-stack Web3 application that brings group expense management to the blockchain. Create shared group vaults, track expenses transparently, and settle debts peer-to-peer — without ever needing to trust a middleman.

[🚀 Live Demo](https://chainsplit.vercel.app) · [📄 Contracts](#-smart-contracts) · [🛠️ Setup](#-getting-started)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏦 **Group Vaults** | Each group deploys its own on-chain smart contract vault — no shared custody |
| 💸 **Equal & Custom Splits** | Split expenses equally or assign custom shares per member |
| 🤝 **On-Chain Settlement** | Settle debts trustlessly via `settleDebt()` with a 1% protocol fee |
| 📊 **Net Balance Calc** | Smart contract computes who owes who, using a greedy debt-minimization algorithm |
| 🔐 **Reentrancy Protected** | All fund-transfer functions are guarded with a custom nonReentrant modifier |
| 🌐 **Live Activity Feed** | Real-time activity timeline with category filters (Expenses, Settlements, Payments) |
| 🔗 **WalletConnect v2** | Connect with MetaMask, Rainbow, Coinbase Wallet, and more via RainbowKit |
| 📁 **IPFS Metadata** | Group avatars and metadata pinned via Pinata to decentralized storage |
| 📱 **Fully Responsive** | Mobile-first design with bottom navigation and desktop sidebar layout |

---

## 🏗️ Architecture

```
chainsplit/
├── contracts/                  # Solidity smart contracts (Hardhat)
│   ├── ChainSplitFactory.sol   # Factory — deploys & indexes GroupVaults
│   └── GroupVault.sol          # Per-group vault with full expense logic
│
├── frontend/                   # Vite + React + TypeScript dApp
│   └── src/
│       ├── pages/              # Dashboard, Groups, Activity, Profile, etc.
│       ├── components/         # Shared UI (Sidebar, etc.)
│       ├── abis/               # Contract ABIs + addresses
│       ├── hooks/              # Custom wagmi hooks
│       ├── services/           # API client
│       └── config/             # Wagmi / RainbowKit chain config
│
└── backend/                    # Express + TypeScript REST API
    └── src/
        ├── routes/             # /groups, /expenses, /users
        ├── models/             # Mongoose schemas (MongoDB)
        ├── services/           # Blockchain indexer, IPFS service
        └── middleware/         # Rate limiting, validation
```

---

## 🔐 Smart Contracts

### `ChainSplitFactory.sol`
The factory is the entry point. It deploys a fresh `GroupVault` for every new group and maintains a global registry.

```solidity
function createGroup(
    string memory _name,
    string memory _emoji,
    string memory _adminName
) external returns (address vault);
```

**Deployed on Cronos Testnet:** `0xe9256300bb409b5Cf8CF16aDD6A0aDB0cc72E5bf`

---

### `GroupVault.sol`
Each group gets its own vault contract. It manages members, tracks expenses, computes settlements, and handles fund flows.

**Key functions:**

| Function | Access | Description |
|---|---|---|
| `addMember(address, name)` | Admin | Invite a wallet to the group |
| `deposit()` | Member | Deposit CRO into the group vault |
| `addExpenseEqual(...)` | Member | Add an equally-split expense |
| `addExpenseCustom(...)` | Member | Add a custom-weighted expense |
| `calculateSettlements()` | Anyone | Returns optimal settlement paths (greedy algo) |
| `settleDebt(address)` | Member | Pay a creditor directly (1% protocol fee) |
| `markGroupSettled()` | Admin | Lock the group once all debts are cleared |
| `withdrawRemaining()` | Admin | Withdraw leftover vault balance post-settlement |

**Security:** Custom `nonReentrant` guard on all ETH-transfer functions. `onlyAdmin` / `onlyMember` / `notSettled` modifiers enforce access control.

---

## 🖥️ Frontend

Built with **Vite + React 18 + TypeScript + TailwindCSS**, powered by **wagmi v2** and **RainbowKit** for wallet connectivity.

### Pages

| Route | Page |
|---|---|
| `/` | Landing — connect wallet & intro |
| `/dashboard` | Overview — stats, groups, recent activity |
| `/groups` | All groups list |
| `/groups/create` | Create a new group vault |
| `/groups/:address` | Group detail — members, expenses, settlement |
| `/activity` | Live activity feed with category filters |
| `/profile` | Profile & settings |

### Stack

- **wagmi v2** — type-safe contract reads/writes
- **RainbowKit** — wallet connection UI
- **viem** — low-level EVM utilities
- **React Router v6** — client-side routing
- **TailwindCSS** — utility-first styling with custom design tokens

---

## ⚙️ Backend

A lightweight **Express + TypeScript** REST API for off-chain metadata indexing and caching.

### Endpoints

```
GET  /api/groups              → List all groups (indexed from chain)
GET  /api/groups/:vault       → Group metadata + member list
GET  /api/groups/:vault/expenses → Expense history
POST /api/users/profile       → Update display name / avatar (IPFS)
```

**Stack:** Express · Mongoose/MongoDB Atlas · ethers.js v6 · Pinata IPFS · express-rate-limit

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Cronos-compatible wallet (MetaMask recommended)
- MongoDB Atlas URI
- Pinata API credentials (for IPFS)

---

### 1. Clone the repo

```bash
git clone https://github.com/0xMayurrr/ChainSplit.git
cd ChainSplit
```

---

### 2. Smart Contracts

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Deploy to Cronos Testnet
cp .env.example .env
# → Add PRIVATE_KEY + CRONOS_TESTNET_RPC_URL to .env
npm run deploy:testnet
```

---

### 3. Backend

```bash
cd backend
cp .env.template .env
# → Fill in MONGODB_URI, PINATA_*, FACTORY_ADDRESS

npm install
npm run dev       # Starts on http://localhost:3000
```

---

### 4. Frontend

```bash
cd frontend
cp .env.example .env
# → Set VITE_FACTORY_ADDRESS, VITE_WALLETCONNECT_PROJECT_ID

npm install
npm run dev       # Starts on http://localhost:5173
```

---

## 🌍 Environment Variables

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_FACTORY_ADDRESS` | Deployed factory contract address (testnet) |
| `VITE_FACTORY_ADDRESS_MAINNET` | Mainnet factory address |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect v2 project ID |
| `VITE_NETWORK` | `testnet` or `mainnet` |
| `VITE_API_URL` | Backend API base URL |

### Backend (`.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `FACTORY_ADDRESS` | Testnet factory address |
| `FACTORY_ADDRESS_MAINNET` | Mainnet factory address |
| `CRONOS_TESTNET_RPC_URL` | Cronos testnet RPC endpoint |
| `PINATA_API_KEY / SECRET / JWT` | Pinata IPFS credentials |
| `FRONTEND_URL` | CORS allowed origin (your Vercel URL) |

---

## 🔗 Network Info

| Network | Chain ID | RPC |
|---|---|---|
| Cronos Mainnet | 25 | `https://evm.cronos.org` |
| Cronos Testnet | 338 | `https://evm-t3.cronos.org` |

> 💧 Get testnet CRO from the [Cronos Testnet Faucet](https://cronos.org/faucet)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ on **Cronos** · Powered by **Solidity** · Designed for **Web3 natives**

⭐ Star this repo if ChainSplit helped you ship something awesome!

</div>
