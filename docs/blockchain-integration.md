# Blockchain Integration Guide

This guide explains how to integrate the X4PN smart contracts into the frontend application.

## Prerequisites

1. MetaMask or another Web3 wallet installed in the user's browser
2. Ethers.js library (already included in the project dependencies)

## Contract Artifacts

The compiled contract artifacts are stored in the `contracts/artifacts` directory:

- `X4PNToken.json` - X4PN Token contract ABI and address
- `X4PNVpnSessions.json` - VPN Sessions contract ABI and address

## Using Contracts in Frontend Components

### 1. Import Contract Artifacts

```typescript
import { x4pnToken, x4pnVpnSessions } from '../../contracts/artifacts';
```

### 2. Initialize Contract Instances

```typescript
import { ethers } from 'ethers';

// Get the browser provider (MetaMask)
const provider = new ethers.BrowserProvider(window.ethereum);

// Get the signer (connected wallet)
const signer = await provider.getSigner();

// Create contract instances
const tokenContract = new ethers.Contract(
  x4pnToken.networks.polygon.address,
  x4pnToken.abi,
  signer
);

const sessionsContract = new ethers.Contract(
  x4pnVpnSessions.networks.polygon.address,
  x4pnVpnSessions.abi,
  signer
);
```

### 3. Common Contract Interactions

#### Get Token Balance
```typescript
const balance = await tokenContract.balanceOf(userAddress);
const formattedBalance = ethers.formatEther(balance);
```

#### Deposit USDC
```typescript
const amountInWei = ethers.parseUnits(amount, 6); // USDC has 6 decimals
const tx = await sessionsContract.deposit(amountInWei);
await tx.wait(); // Wait for transaction confirmation
```

#### Start VPN Session
```typescript
const tx = await sessionsContract.startSession(nodeOperatorAddress, ratePerSecond);
await tx.wait();
```

## Helper Functions

We've created helper functions in `client/src/lib/contracts.ts` to simplify common interactions:

```typescript
import { 
  depositUSDC,
  withdrawUSDC,
  startVPNSession,
  getX4PNBalance
} from '@/lib/contracts';

// Example usage
const tx = await depositUSDC(amountInWei, signer);
await tx.wait();
```

## Error Handling

Always wrap contract interactions in try/catch blocks:

```typescript
try {
  const tx = await sessionsContract.deposit(amountInWei);
  await tx.wait();
  // Handle success
} catch (error) {
  // Handle error (user rejected, insufficient funds, etc.)
  console.error('Transaction failed:', error);
}
```

## Network Considerations

Ensure users are connected to the correct network (Polygon Mainnet):

```typescript
const chainId = await provider.getNetwork().then(network => network.chainId);
if (chainId !== 137) {
  // Prompt user to switch to Polygon Mainnet
}
```

## Best Practices

1. Always wait for transaction confirmation before updating UI
2. Provide clear feedback during transaction processing
3. Handle gas estimation errors gracefully
4. Cache contract instances to avoid recreating them
5. Use proper error messages for common failure cases