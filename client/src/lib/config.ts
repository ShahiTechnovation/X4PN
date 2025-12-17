// Frontend configuration
export const CONFIG = {
  // Default RPC endpoints for Polygon
  RPC_ENDPOINTS: {
    polygon: "https://polygon-rpc.com",
    mumbai: "https://rpc-mumbai.maticvigil.com",
    amoy: "https://rpc-amoy.polygon.technology"
  },
  
  // Fallback RPC endpoints - more reliable options
  FALLBACK_RPC_ENDPOINTS: {
    polygon: [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.maticvigil.com",
      "https://matic-mainnet.chainstacklabs.com",
      "https://polygon-bor.publicnode.com",
      "https://polygon.llamarpc.com",
      "https://1rpc.io/matic"
    ],
    mumbai: [
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-mumbai.chainstacklabs.com",
      "https://polygon-mumbai-bor.publicnode.com"
    ],
    amoy: [
      "https://rpc-amoy.polygon.technology",
      "https://polygon-amoy-bor.publicnode.com"
    ]
  },
  
  // Network configuration
  NETWORKS: {
    polygon: {
      chainId: 137,
      name: "Polygon Mainnet"
    },
    mumbai: {
      chainId: 80001,
      name: "Polygon Mumbai Testnet"
    },
    amoy: {
      chainId: 80002,
      name: "Polygon Amoy Testnet"
    }
  }
};