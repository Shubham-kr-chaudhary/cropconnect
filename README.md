# Crop Connect

**College Major Project**

Crop Connect is a decentralized contract farming platform designed to bridge the trust gap between smallholder farmers and large agribusiness firms. Leveraging blockchain and smart contracts, Crop Connect enables secure, transparent negotiations and automated enforcement of agreements.

---

## Table of Contents

1. [Features](#features)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Installation & Setup](#installation--setup)
4. [Usage](#usage)
5. [Smart Contracts](#smart-contracts)
6. [Testing](#testing)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

---

## Features

* **Role-Based Authentication**: Farmers and Firms choose their role during sign‑up and login.
* **User Profiles**: Dynamic profile pages with switchable panels displaying transaction history, contract logs, and transfer records.
* **Marketplace**: Browse and purchase produce from multiple farmers. Supports search, price filtering, and genre-based filtering.
* **Smart Contracts**: Solidity contracts deployed on Ethereum via Hardhat to automate payments and enforce agreements without intermediaries.
* **Admin Dashboard**: View and manage all user accounts, contracts, and transaction logs in one place.
* **Real‑Time Updates**: Socket.io powered notifications for contract status changes and new offers.

---

## Architecture & Tech Stack

| Layer              | Technology                              |
| ------------------ | --------------------------------------- |
| **Frontend**       | React, Next.js, Tailwind CSS, shadcn/ui |
| **Backend**        | Node.js, Express, MongoDB               |
| **Blockchain**     | Solidity, Hardhat, Ethereum             |
| **Real‑Time**      | Socket.io                               |
| **Authentication** | JWT, Bcrypt                             |
| **Deployment**     | Vercel (Frontend), Heroku (Backend)     |

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/crop-connect.git
   cd crop-connect
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   * Runs on `http://localhost:3000` by default.

3. **Backend**

   ```bash
   cd ../backend
   npm install
   npm run start:dev
   ```

   * Runs on `http://localhost:5000`.

4. **Smart Contracts**

   ```bash
   cd ../contracts
   npm install
   npx hardhat compile
   npx hardhat test
   npx hardhat run scripts/deploy.js --network <network-name>
   ```

   * Configure your `.env` with RPC URLs and private keys.

5. **Environment Variables**

   ```ini
   # .env (Backend and Contracts)
   MONGO_URI=
   JWT_SECRET=
   ETHEREUM_RPC_URL=
   PRIVATE_KEY=
   ```

---

## Usage

1. **Sign Up & Login**

   * Choose your role (Farmer or Firm) on the sign‑up page.
2. **Farmer Portal**

   * Create and manage produce listings in your stall.
   * View incoming offers and negotiate terms.
3. **Firm Portal**

   * Browse marketplace, filter by genre, price, and search keywords.
   * Initiate contract offers to farmers.
4. **Smart Contract Execution**

   * Upon offer acceptance, funds are escrowed in the smart contract and released on delivery.
5. **Admin Dashboard**

   * Monitor all contracts, user activity, and transaction logs.

---

## Smart Contracts

* Written in **Solidity** (version 0.8.x).
* Managed and tested using **Hardhat**.
* Key contracts:

  * `FarmContract.sol` – Core contract for offer creation, escrow, and settlement.
  * `Governance.sol` – Role management and access control.

---

## Testing

* **Frontend**: Jest + React Testing Library
* **Backend**: Mocha + Chai
* **Smart Contracts**: Hardhat test suite

Run all tests:

```bash
npm run test:all
```

---
