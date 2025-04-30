import { Chain } from "viem";

// Phron AI Testnet
export const phronAI: Chain = {
  id: 7744,
  name: "Phron AI Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "PHRON",
    symbol: "TPHR",
  },
  rpcUrls: {
    default: { http: ["https://testnet.phron.ai"] },
    public: { http: ["https://testnet.phron.ai"] },
  },
  blockExplorers: {
    default: {
      name: "Phron Explorer",
      url: "https://testnet.phronscan.io/",
    },
  },
  testnet: true,
};

// Arbitrum Sepolia
export const arbitrumSepolia: Chain = {
  id: 421614,
  name: "Arbitrum Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://arbitrum-sepolia.gateway.tenderly.co"] },
    public: { http: ["https://arbitrum-sepolia.gateway.tenderly.co"] },
  },
  blockExplorers: {
    default: {
      name: "Arbitrum Sepolia Explorer",
      url: "https://explorer.arbitrum-sepolia.com",
    },
  },
  testnet: true,
};

// Binance Smart Chain
export const binanceSmartChain: Chain = {
  id: 56,
  name: "Binance Smart Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Coin",
    symbol: "BNB",
  },
  rpcUrls: {
    default: { http: ["https://bsc-dataseed.binance.org/"] },
    public: { http: ["https://bsc-dataseed.binance.org/"] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
  testnet: false,
};

// Hyperledger Besu
export const hyperledgerBesu: Chain = {
  id: 1337,
  name: "Hyperledger Besu",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
  blockExplorers: {
    default: { name: "Block Explorer", url: "http://localhost:25000" },
  },
  testnet: true,
};

// StarkNet
export const starknet: Chain = {
  id: 23456,
  name: "StarkNet",
  nativeCurrency: {
    decimals: 18,
    name: "StarkNet Token",
    symbol: "STRK",
  },
  rpcUrls: {
    default: { http: ["https://alpha4.starknet.io"] },
    public: { http: ["https://alpha4.starknet.io"] },
  },
  blockExplorers: {
    default: { name: "StarkScan", url: "https://starkscan.co" },
  },
  testnet: true,
};

// Tron
export const tron: Chain = {
  id: 728126428, // Tron's chain ID
  name: "Tron Mainnet",
  nativeCurrency: {
    decimals: 6,
    name: "Tronix",
    symbol: "TRX",
  },
  rpcUrls: {
    default: { http: ["https://api.trongrid.io"] },
    public: { http: ["https://api.trongrid.io"] },
  },
  blockExplorers: {
    default: { name: "TronScan", url: "https://tronscan.org" },
  },
  testnet: false,
};

export const beammainnet: Chain = {
  id: 4337, // Tron's chain ID
  name: "Beam Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "OnBeam",
    symbol: "BEAM",
  },
  rpcUrls: {
    default: { http: ["https://build.onbeam.com/rpc"] },
    public: { http: ["https://build.onbeam.com/rpc"] },
  },
  blockExplorers: {
    default: { name: "OnBeam", url: "https://subnets.avax.network/beam" },
  },
  testnet: false,
};

export const beamtestnet: Chain = {
  id: 13337, // Tron's chain ID
  name: "Beam Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "OnBeam",
    symbol: "BEAM",
  },
  rpcUrls: {
    default: { http: ["https://build.onbeam.com/rpc/testnet"] },
    public: { http: ["https://build.onbeam.com/rpc/testnet"] },
  },
  blockExplorers: {
    default: { name: "OnBeam", url: "https://subnets.avax.network/beam" },
  },
  testnet: true,
};
