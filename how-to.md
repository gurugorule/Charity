# Ethereum Charity DApp - Setup Guide

This guide will walk you through setting up and running the Ethereum Charity DApp locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16 or higher)
- npm (usually comes with Node.js)
- MongoDB (local installation or Atlas account)
- MetaMask browser extension
- Git (for cloning the repository)
- A code editor (VS Code recommended)

## Step 1: Environment Setup

1. Install MetaMask:
   - Visit [MetaMask](https://metamask.io) and install the browser extension
   - Create a new wallet or import an existing one
   - Switch to Sepolia testnet:
     1. Open MetaMask
     2. Click the network dropdown (usually shows "Ethereum Mainnet")
     3. Select "Sepolia Test Network"
     4. If not visible, go to Settings > Networks > Add Network > Add Sepolia

2. Get Sepolia ETH:
   - Visit [Sepolia Faucet](https://sepoliafaucet.com)
   - Enter your MetaMask wallet address
   - Request test ETH (this is free and only works on testnet)

3. Get Infura API Key:
   - Visit [Infura](https://infura.io)
   - Create a free account
   - Create a new project
   - Copy your project ID from the settings page

## Step 2: Project Setup

1. Clone and Install Dependencies:
   ```bash
   git clone <repository-url>
   cd charity-dapp
   npm install
   ```

2. Configure Environment Variables:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file with your values:
   ```
   # Get this from Infura
   SEPOLIA_URL=https://sepolia.infura.io/v3/your-project-id

   # Your MetaMask private key (from account details)
   PRIVATE_KEY=your-metamask-private-key

   # MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/charity-dapp
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charity-dapp

   # Backend port
   PORT=5000
   ```

   To get your MetaMask private key:
   1. Open MetaMask
   2. Click the three dots
   3. Account Details
   4. Export Private Key
   5. Enter your password
   6. Copy the private key

## Step 3: Smart Contract Deployment

1. Compile the smart contract:
   ```bash
   npm run hardhat:compile
   ```

2. Deploy to Sepolia:
   ```bash
   npm run hardhat:deploy
   ```

3. Save the contract address that appears in the console:
   ```
   CharityFund deployed to: 0x...
   ```

## Step 4: Running the Application

1. Start all services:
   ```bash
   npm run dev:all
   ```

   This command starts:
   - Frontend development server
   - Backend API server
   - MongoDB connection

2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Using the Application

1. Connect Wallet:
   - Click "Connect Wallet" button
   - Approve the MetaMask connection
   - Ensure you're on Sepolia network

2. Make a Donation:
   - Enter the amount in ETH
   - Click "Donate ETH"
   - Confirm the transaction in MetaMask
   - Wait for transaction confirmation

3. View Transactions:
   - All transactions appear in the Transaction History panel
   - Click "View on Etherscan" to see transaction details
   - Contract stats update automatically

## Smart Contract Details

The contract has a threshold of 0.1 ETH. When total donations reach this amount:
- Funds automatically transfer to the charity owner
- Transaction appears in history
- Contract balance resets

## Troubleshooting

1. MetaMask Connection Issues:
   - Ensure you're on Sepolia network
   - Try disconnecting and reconnecting
   - Clear browser cache if needed

2. Transaction Failures:
   - Check you have enough Sepolia ETH
   - Ensure gas price isn't too low
   - Wait for previous transactions to complete

3. Backend Connection Issues:
   - Verify MongoDB is running
   - Check .env configuration
   - Ensure port 5000 is available

4. Smart Contract Issues:
   - Verify deployment was successful
   - Check contract address in src/contracts/CharityFund.ts
   - Ensure you're using the correct network

## Development Notes

- Frontend runs on Vite (port 5173)
- Backend runs on Express (port 5000)
- MongoDB should be running (default port 27017)
- Contract events are monitored for automatic updates
- All transactions are logged to MongoDB

## Security Considerations

- Never share your private key
- Use only test ETH on Sepolia
- Keep your .env file secure
- Regular backups of MongoDB data recommended
- Monitor contract events for unusual activity

## Support

For issues:
1. Check the console for error messages
2. Verify all services are running
3. Confirm network connectivity
4. Ensure correct environment configuration

## Maintenance

Regular maintenance tasks:
1. Update npm packages
2. Monitor MongoDB storage
3. Check contract balance
4. Review transaction logs
5. Update environment variables as needed