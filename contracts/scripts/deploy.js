const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // USDC address on Polygon Mumbai testnet
  // For mainnet, use the actual USDC contract address
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23";
  
  // Deploy X4PNToken
  console.log("\nDeploying X4PNToken...");
  const X4PNToken = await ethers.getContractFactory("X4PNToken");
  const x4pnToken = await X4PNToken.deploy();
  await x4pnToken.waitForDeployment();
  const x4pnTokenAddress = await x4pnToken.getAddress();
  console.log("X4PNToken deployed to:", x4pnTokenAddress);

  // Deploy X4PNVpnSessions
  console.log("\nDeploying X4PNVpnSessions...");
  const X4PNVpnSessions = await ethers.getContractFactory("X4PNVpnSessions");
  const vpnSessions = await X4PNVpnSessions.deploy(
    USDC_ADDRESS,
    x4pnTokenAddress,
    deployer.address // Fee recipient
  );
  await vpnSessions.waitForDeployment();
  const vpnSessionsAddress = await vpnSessions.getAddress();
  console.log("X4PNVpnSessions deployed to:", vpnSessionsAddress);

  // Add VpnSessions contract as minter for X4PN token
  console.log("\nAdding VpnSessions as minter...");
  const addMinterTx = await x4pnToken.addMinter(vpnSessionsAddress);
  await addMinterTx.wait();
  console.log("VpnSessions added as minter");

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE");
  console.log("========================================");
  console.log("X4PNToken:", x4pnTokenAddress);
  console.log("X4PNVpnSessions:", vpnSessionsAddress);
  console.log("USDC (testnet):", USDC_ADDRESS);
  console.log("Fee Recipient:", deployer.address);
  console.log("========================================");

  // Verification instructions
  console.log("\nTo verify contracts on PolygonScan:");
  console.log(`npx hardhat verify --network polygon_mumbai ${x4pnTokenAddress}`);
  console.log(`npx hardhat verify --network polygon_mumbai ${vpnSessionsAddress} "${USDC_ADDRESS}" "${x4pnTokenAddress}" "${deployer.address}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
