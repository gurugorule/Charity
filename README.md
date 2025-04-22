# Ethereum Charity DApp

A full-stack decentralized application for charity donations using the Ethereum blockchain (Sepolia testnet).

## Features

- Smart contract for secure, transparent donations
- Automatic fund transfer when threshold is reached
- MongoDB integration for transaction logging
- React frontend with MetaMask wallet integration
- Responsive design optimized for all devices

## Project Structure

```
charity-dapp/
├── contracts/               # Smart contract files
│   ├── contracts/           # Solidity contracts
│   ├── scripts/             # Deployment scripts
│   └── test/                # Contract tests
├── server/                  # Backend API
│   └── models/              # MongoDB schemas
├── src/                     # Frontend React app
│   ├── components/          # UI components
│   ├── contracts/           # Contract ABIs and addresses
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
└── .env.example             # Environment variables template
```

## Prerequisites

- Node.js ≥16 & npm
- MetaMask browser extension
- MongoDB (local or Atlas)
- Sepolia Testnet ETH (available from faucets)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Install dependencies:
   ```
   npm install
   ```
4. Compile and deploy smart contract:
   ```
   npm run hardhat:compile
   npm run hardhat:deploy
   ```
5. Start the development server:
   ```
   npm run dev:all
   ```

## Smart Contract

The `CharityFund` contract handles donations and automatic fund transfers when a threshold is reached.

### Key Functions:

- `deposit()`: Accept ETH donations
- `transferFunds()`: Automatically transfer funds to charity owner
- `getContractBalance()`: View current contract balance

## Backend API

RESTful API for logging transactions and retrieving donation history.

### Endpoints:

- `POST /api/logs/donation`: Log a new donation
- `POST /api/logs/charity-transfer`: Log a charity transfer
- `GET /api/logs/all`: Get all transaction logs

## Frontend

React application with MetaMask integration for interacting with the smart contract.

### Key Features:

- Wallet connection with MetaMask
- Contract balance display
- Donation form
- Transaction history
- Responsive design

## Testing

The project includes Hardhat tests for the smart contract. Run them with:

```
cd contracts
npx hardhat test
```
