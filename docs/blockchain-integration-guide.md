# X4PN Blockchain Integration Guide

This guide explains how to properly integrate the X4PN smart contracts into the frontend application once they are fully implemented.

## Current State

The X4PN project includes two main smart contracts:

1. **X4PNToken.sol** - An ERC-20 token contract for the X4PN reward token
2. **X4PNVpnSessions.sol** - A contract managing VPN sessions, USDC payments, and X4PN rewards

Currently, only partial functionality is implemented in these contracts.

## Contract Addresses

The contracts will be deployed on Base Mainnet:

- **X4PN Token**: `[To be deployed]`
- **X4PN VPN Sessions**: `[To be deployed]`

## Available Functions

### X4PN Token Contract

The following functions are implemented:

1. `balanceOf(address)` - View function to get token balance
2. `approve(address, uint256)` - Approve spending allowance
3. `transfer(address, uint256)` - Transfer tokens
4. `transferFrom(address, address, uint256)` - Transfer tokens from approved allowance
5. `mint(address, uint256)` - Mint new tokens (only for authorized minters)
6. `mintRewards(address, uint256, uint256)` - Mint reward tokens for VPN usage
7. `burn(uint256)` - Burn tokens
8. `burnFrom(address, uint256)` - Burn tokens from approved allowance
9. `addMinter(address)` - Add a new minter (owner only)
10. `removeMinter(address)` - Remove a minter (owner only)

### X4PN VPN Sessions Contract

The following functions are implemented:

### VPN Session Management
- `startSession(address, uint256)` - Start a new VPN session
- `endSession()` - End the current VPN session
- `settleSession()` - Settle payments for the current session
- `settleSessionWithSignature(uint256, uint256, uint256, bytes)` - Settle using off-chain signature (x402)
- `getActiveSession(address)` - Get details of active session for a user
- `getSession(uint256)` - Get details of a specific session
- `registerAsOperator()` - Register as a VPN node operator

### Financial Operations
- `deposit(uint256)` - Deposit USDC to use for VPN payments
- `withdraw(uint256)` - Withdraw USDC balance

## Implementation Roadmap

### Phase 1: Core Functionality (Completed)
1. Implement session management functions in X4PNVpnSessions.sol
2. Implement financial operations in X4PNVpnSessions.sol
3. Update frontend components to use real contract functions

### Phase 2: Advanced Features
1. Implement governance features
2. Add multi-token support
3. Implement staking mechanisms

## Frontend Integration

### Using Contract Functions

The frontend uses the `@/lib/contracts.ts` file to interact with smart contracts. Example usage:

```typescript
import { ethers } from 'ethers';
import { 
  getX4PNTokenContract, 
  getVpnSessionsContract,
  getX4PNBalance,
  mintRewards
} from '@/lib/contracts';

// Get token balance
const balance = await getX4PNBalance(signer, userAddress);

// Mint rewards (requires authorization)
const tx = await mintRewards(userAddress, amount, sessionId, signer);
await tx.wait();
```

### Error Handling

All contract functions should properly handle errors:

```typescript
try {
  const tx = await contractFunction(params, signer);
  const receipt = await tx.wait();
  if (receipt.status === 1) {
    // Success
  } else {
    // Transaction failed
  }
} catch (error) {
  // Handle error appropriately
  console.error("Contract call failed:", error);
}
```

## Testing

### Unit Tests

Smart contracts should have comprehensive unit tests covering:

1. All public functions
2. Edge cases and error conditions
3. Security vulnerabilities
4. Gas optimization

### Integration Tests

Frontend components should be tested with:

1. Mock contract responses
2. Network error conditions
3. Transaction confirmation flows
4. User interaction scenarios

## Deployment

### Test Networks

Before deploying to mainnet, test on:

1. Base Sepolia Testnet
2. Local Hardhat network

### Mainnet Deployment

Deployment checklist:

1. Verify all contract functions work as expected
2. Audit smart contracts for security vulnerabilities
3. Test frontend integration thoroughly
4. Prepare deployment scripts
5. Execute deployment with proper multisig controls

## Future Enhancements

Deployment checklist:

1. Verify all contract functions work as expected
2. Audit smart contracts for security vulnerabilities
3. Test frontend integration thoroughly
4. Prepare deployment scripts
5. Execute deployment with proper multisig controls

## Future Enhancements

### Smart Contract Improvements
1. Upgradeable contract pattern
2. Gas optimization
3. Advanced reward mechanisms
4. Cross-chain functionality

### Frontend Improvements
1. Real-time transaction status updates
2. Enhanced error messaging
3. Transaction history tracking
4. Improved wallet integration

## Troubleshooting

### Common Issues

1. **Insufficient gas**: Ensure users have enough MATIC for gas fees
2. **Contract not found**: Verify contract addresses are correct
3. **Unauthorized access**: Check that only authorized addresses can call certain functions
4. **Network issues**: Ensure users are connected to the correct network

### Debugging Tips

1. Use PolygonScan to verify transaction details
2. Check contract events for debugging information
3. Use console.log in smart contracts during development
4. Monitor gas usage to optimize contract efficiency