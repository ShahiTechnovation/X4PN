# Blockchain Integration Documentation

This document explains how to use the blockchain-enabled components in the X4PN VPN application.

## Overview

The blockchain integration allows users to interact directly with the smart contracts deployed on Base Mainnet:
- X4PN Token Contract: `0xd84612a360359cF85E991A01dEAbB3dc8ab121F8`
- X4PN VPN Sessions Contract: `0xDFcb0654919A4AE22eCfF196cd015F156053fd6D`

## New Blockchain Components

### 1. Blockchain Dashboard (`/blockchain`)

A new dashboard page that interacts directly with the blockchain contracts instead of using the backend API.

### 2. Blockchain Deposit Modal

Replaces the traditional deposit modal with direct blockchain interactions:
- Approves USDC spending
- Deposits USDC to the VPN contract
- Shows transaction status and links to Basescan

### 3. Blockchain Withdraw Modal

Allows withdrawal of USDC directly from the VPN contract:
- Withdraws USDC to the user's wallet
- Shows transaction status and links to Basescan

### 4. Blockchain Session Control

Manages VPN sessions directly through smart contract interactions:
- Starts VPN sessions
- Settles ongoing sessions
- Ends VPN sessions
- Real-time cost calculation

## Contract Interaction Library

All blockchain interactions are handled through the contract helper functions in `client/src/lib/contracts.ts`:

### Key Functions

```typescript
// Deposit USDC to VPN contract
await depositUSDC(amountInWei, signer);

// Withdraw USDC from VPN contract
await withdrawUSDC(amountInWei, signer);

// Start a VPN session
await startVPNSession(nodeOperatorAddress, ratePerSecond, signer);

// Settle an ongoing session
await settleVPNSession(signer);

// End a VPN session
await endVPNSession(signer);

// Get user's USDC balance in VPN contract
await getUserBalance(signer, userAddress);

// Get user's X4PN token balance
await getX4PNBalance(signer, userAddress);
```

## How to Test

1. Navigate to the Blockchain Dashboard at `/blockchain`
2. Connect your MetaMask wallet
3. Ensure you're on Base Mainnet
4. Deposit USDC using the blockchain deposit modal
5. Connect to a VPN node using the blockchain session control
6. Withdraw funds using the blockchain withdraw modal

## Development Notes

### Contract Addresses

The contract addresses are stored in `contracts/artifacts/`:
- `X4PNToken.json` - Contains X4PN token ABI and address
- `X4PNVpnSessions.json` - Contains VPN sessions ABI and address

### Error Handling

All blockchain interactions include proper error handling:
- Transaction rejection by user
- Insufficient funds
- Network errors
- Contract execution errors

### User Experience

- Real-time transaction status updates
- Links to Basescan for transaction verification
- Automatic balance refreshing
- Clear error messages

## Future Enhancements

1. **X4PN Token Withdrawal**: Currently only USDC withdrawal is implemented
2. **Advanced Session Management**: More granular session controls
3. **Gas Optimization**: More efficient contract interactions
4. **Multi-network Support**: Support for testnets and other chains