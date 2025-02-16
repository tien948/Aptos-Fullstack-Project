# Property Registry DApp

A decentralized application (DApp) built on Aptos blockchain for registering and managing property records. This DApp allows users to register properties with unique IDs and values, and includes functionality for property ownership management.

## 📝 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

## ✨ Features
- Connect with Petra Wallet
- Register new properties with unique IDs
- Track property values
- View registered properties
- Transfer property ownership
- Real-time transaction status updates
- Backend API for blockchain interactions

## 🛠 Tech Stack
- Move (Smart Contract Language)
- Aptos Blockchain
- Next.js
- TypeScript
- Tailwind CSS
- Petra Wallet

## 📋 Prerequisites
- Node.js v16 or higher
- Aptos CLI
- Petra Wallet browser extension
- Git

## 📁 Project Structure
```
property-registry-dapp/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx    # Main DApp interface
│   │   └── components/     # React components
│   ├── package.json
│   └── .env.local
│
├── backend/
│   ├── sources/
│   │   ├── PropertyRegistry.move   # Main contract
│   │   └── tests/                  # Move test files
│   ├── Move.toml                   # Move package manifest
│   └── scripts/                    # Deployment scripts
│
└── README.md
```

## 🔧 Backend Setup

### 1. Configure Move Package
The `Move.toml` file in the backend directory defines your package configuration:
```toml
[package]
name = "PropertyToken"
version = "1.0.0"

[addresses]
PropertyToken = "_"

[dependencies]
AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "mainnet" }
```

### 2. Smart Contract Structure
The main contract file (`PropertyRegistry.move`) contains:
```move
module PropertyToken::PropertyRegistry {
    use std::signer;
    use std::vector;

    // Error codes
    const PROPERTY_ALREADY_REGISTERED: u64 = 0;
    const PROPERTY_NOT_FOUND: u64 = 1;
    const UNAUTHORIZED: u64 = 2;

    // Structs and Resources
    struct Property has key, store { ... }
    struct PropertyList has key { ... }

    // Main Functions
    public fun initialize(...) { ... }
    public entry fun register_property(...) { ... }
    public entry fun transfer_ownership(...) { ... }
    public fun property_exists(...) { ... }
    public fun get_property_count(...) { ... }
}
```

### 3. Running Tests
```bash
cd backend
aptos move test
```

### 4. Compiling the Contract
```bash
cd backend
aptos move compile
```

## 📦 Smart Contract Deployment

### 1. Initialize Aptos CLI
```bash
aptos init
```

### 2. Configure the Network
```bash
# For testnet
aptos config set-network testnet

# For devnet
aptos config set-network devnet
```

### 3. Deploy the Contract
```bash
cd backend
aptos move publish --named-addresses PropertyToken=your_account_address --network testnet
```

### 4. Verify Deployment
```bash
aptos account list --query modules
```

## 💻 Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_MODULE_ADDRESS=your_module_address_here
```

### 3. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Connecting Your Wallet
1. Install the Petra Wallet browser extension
2. Create or import a wallet
3. Ensure you have test tokens (for testnet)
4. Click "Connect Wallet" in the DApp

### Registering a Property
1. Enter the Property ID (unique identifier)
2. Input the property value in APT
3. Provide the property address
4. Click "Register Property"
5. Confirm the transaction in Petra Wallet

## 🏗 Architecture

### Backend Architecture
```
backend/
├── sources/
│   ├── PropertyRegistry.move    # Main contract
│   └── tests/
│       └── property_tests.move  # Unit tests
├── Move.toml                    # Package manifest
└── scripts/
    ├── deploy.sh               # Deployment script
    └── test.sh                 # Test runner
```

### Smart Contract Components
1. **Property Resource**
   ```move
   struct Property has key, store {
       owner: address,
       property_id: u64,
       value: u64
   }
   ```

2. **PropertyList Resource**
   ```move
   struct PropertyList has key {
       properties: vector<u64>
   }
   ```

3. **Key Functions**
   - `initialize`: Sets up initial state
   - `register_property`: Registers new property
   - `transfer_ownership`: Transfers property to new owner
   - `property_exists`: Checks property existence
   - `get_property_count`: Returns property count

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   └── page.tsx    # Main DApp interface
│   ├── components/     # React components
│   └── utils/         # Helper functions
└── public/            # Static assets
```

## ❗ Troubleshooting

### Common Issues

1. **"Failed to register property"**
   - Ensure you're on the correct network (testnet/devnet)
   - Verify you have sufficient funds
   - Check if property ID is unique
   - Confirm module address is correct

2. **"Petra wallet not found"**
   - Install Petra Wallet extension
   - Refresh the page
   - Make sure the wallet is unlocked

3. **"Move abort"**
   - Property might already be registered
   - Invalid property ID or value
   - Insufficient permissions

4. **Contract Deployment Issues**
   - Ensure correct network configuration
   - Verify account has sufficient funds
   - Check address configurations in Move.toml
   - Validate package dependencies

### Network Configuration
Make sure your network configuration matches your deployment:

```typescript
// For testnet
const config = new AptosConfig({ network: Network.TESTNET });

// For devnet
const config = new AptosConfig({ network: Network.DEVNET });
```

## 🔒 Security Considerations
- Always verify transaction details before signing
- Keep your private keys secure
- Never share sensitive wallet information
- Validate property IDs and values before submission
- Implement proper access controls in smart contracts
- Test thoroughly on testnet before mainnet deployment

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details