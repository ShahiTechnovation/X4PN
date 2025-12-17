# X4PN Contract Artifacts

This directory contains the compiled artifacts and deployment information for the X4PN smart contracts.

## Deployed Contracts

### X4PN Token
- **Network**: Polygon Mainnet
- **Address**: 0x91a26c236241a7211BD3ebFC867Fa1A7ca6D0A33
- **ABI**: Included in X4PNToken.json

### X4PN VPN Sessions
- **Network**: Polygon Mainnet
- **Address**: 0x148466D329C9E1B502fd41A65a073b39b3D43751
- **ABI**: Included in X4PNVpnSessions.json
## Usage

To use these artifacts in your frontend or backend code:

```javascript
import { x4pnToken, x4pnVpnSessions } from './artifacts';

// Access the ABI
const tokenAbi = x4pnToken.abi;
const sessionsAbi = x4pnVpnSessions.abi;

// Access the contract addresses
const tokenAddress = x4pnToken.networks.polygon.address;
const sessionsAddress = x4pnVpnSessions.networks.polygon.address;
```

### Frontend Integration

The frontend can interact with the contracts directly using ethers.js:

```typescript
import { ethers } from 'ethers';
import { x4pnToken, x4pnVpnSessions } from './artifacts';

// Get contract instances
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

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

// Example: Get user's X4PN balance
const balance = await tokenContract.balanceOf(userAddress);

// Example: Deposit USDC
const tx = await sessionsContract.deposit(amount);
await tx.wait(); // Wait for transaction confirmation
```

## Directory Structure

- `X4PNToken.json` - Contains ABI and deployment address for the X4PN Token contract
- `X4PNVpnSessions.json` - Contains ABI and deployment address for the VPN Sessions contract
- `index.js` - Export file for easy importing of all contracts