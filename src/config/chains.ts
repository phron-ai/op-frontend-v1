interface ChainInfo {
  icon: string;
  name: string;
  explorer: string;
}

type ChainInfoMap = Record<string, ChainInfo>;

const networks: ChainInfoMap = {
  "1": {
    icon: "/images/chains/1.png",
    name: "Ethereum",
    explorer: "https://etherscan.io",
  },
  "11155111": {
    icon: "/images/chains/1.png",
    name: "Sepolia",
    explorer: "https://sepolia.etherscan.io",
  },
  "17000": {
    icon: "/images/chains/17000.png",
    name: "Holesky",
    explorer: "https://holesky.etherscan.io",
  },
  "42161": {
    icon: "/images/chains/42161.png",
    name: "Arbitrum",
    explorer: "https://arbiscan.io",
  },
  "421614": {
    icon: "/images/chains/42161.png",
    name: "Arbitrum Sepolia",
    explorer: "https://sepolia.arbiscan.io",
  },
  "99999": {
    icon: "/images/chains/7744.png",
    name: "Phron AI Testnet",
    explorer: "https://testnet.phronscan.io",
  },
  "7744": {
    icon: "/images/chains/7744.png",
    name: "Phron Testnet",
    explorer: "https://testnet.phronscan.io",
  },
  "80085": {
    icon: "/images/chains/80085.png",
    name: "Berachain",
    explorer: "https://berascan.com",
  },
  "80094": {
    icon: "/images/chains/80085.png",
    name: "Berachain",
    explorer: "https://berascan.com",
  },
  "99998": {
    icon: "/images/chains/80085.png",
    name: "Berachain Artio",
    explorer: "https://berascan.com",
  },
  "288": {
    icon: "/images/chains/288.png",
    name: "Boba Network",
    explorer: "https://bobascan.com",
  },
  "28882": {
    icon: "/images/chains/288.png",
    name: "Boba Sepolia",
    explorer: "https://sepolia.testnet.bobascan.com",
  },
  "1313161554": {
    icon: "/images/chains/1313161554.png",
    name: "Aurora",
    explorer: "https://aurorascan.dev",
  },
  "1313161555": {
    icon: "/images/chains/1313161554.png",
    name: "Aurora Testnet",
    explorer: "https://testnet.aurorascan.dev",
  },
  "43114": {
    icon: "/images/chains/43114.png",
    name: "Avalanche",
    explorer: "https://snowtrace.io",
  },
  "8453": {
    icon: "/images/chains/8453.png",
    name: "Base",
    explorer: "https://basescan.org",
  },
  "84532": {
    icon: "/images/chains/8453.png",
    name: "Base Sepolia",
    explorer: "https://sepolia.basescan.org",
  },
  "56": {
    icon: "/images/chains/56.png",
    name: "BSC",
    explorer: "https://bscscan.com",
  },
  "97": {
    icon: "/images/chains/97.png",
    name: "BSC Testnet",
    explorer: "https://bscscan.com",
  },
  "25": {
    icon: "/images/chains/25.png",
    name: "Cronos Mainnet",
    explorer: "https://cronoscan.com",
  },
  "338": {
    icon: "/images/chains/25.png",
    name: "Cronos Testnet",
    explorer: "https://testnet.cronoscan.com",
  },
  "9001": {
    icon: "/images/chains/9001.png",
    name: "Evmos",
    explorer: "https://atomscan.com/evmos",
  },
  "9000": {
    icon: "/images/chains/9001.png",
    name: "Evmos Testnet",
    explorer: "https://atomscan.com/evmos",
  },
  "250": {
    icon: "/images/chains/250.png",
    name: "Fantom",
    explorer: "https://ftmscan.com",
  },
  "4002": {
    icon: "/images/chains/250.png",
    name: "Fantom Testnet",
    explorer: "https://testnet.ftmscan.com",
  },
  "100": {
    icon: "/images/chains/100.png",
    name: "Gnosis",
    explorer: "https://gnosisscan.io",
  },
  "10200": {
    icon: "/images/chains/100.png",
    name: "Gnosis Chiado",
    explorer: "https://blockscout.chiadochain.net",
  },
  "1666600000": {
    icon: "/images/chains/1666600000.png",
    name: "Harmony One",
    explorer: "https://explorer.harmony.one",
  },
  "1337": {
    icon: "/images/chains/1337.png",
    name: "Hyperledger Besu",
    explorer: "https://etherscan.io",
  },
  "8217": {
    icon: "/images/chains/8217.png",
    name: "Klaytn",
    explorer: "https://scope.klaytn.com",
  },
  "1088": {
    icon: "/images/chains/1088.png",
    name: "Metis",
    explorer: "https://andromeda-explorer.metis.io",
  },
  "1284": {
    icon: "/images/chains/1284.png",
    name: "Moonbeam",
    explorer: "https://moonscan.io",
  },
  "10": {
    icon: "/images/chains/10.png",
    name: "Optimism",
    explorer: "https://optimistic.etherscan.io",
  },
  "1101": {
    icon: "/images/chains/1101.png",
    name: "Polygon zkEVM",
    explorer: "https://zkevm.polygonscan.com",
  },
  "137": {
    icon: "/images/chains/1101.png",
    name: "Polygon",
    explorer: "https://polygonscan.com",
  },
  "2345678": {
    icon: "/images/chains/2345678.png",
    name: "StarkNet",
    explorer: "https://starkscan.co",
  },
  "57": {
    icon: "/images/chains/57.png",
    name: "Syscoin Mainnet",
    explorer: "https://explorer.syscoin.org",
  },
  "40": {
    icon: "/images/chains/40.png",
    name: "Telos",
    explorer: "https://www.teloscan.io",
  },
  "324": {
    icon: "/images/chains/324.png",
    name: "zkSync",
    explorer: "https://explorer.zksync.io",
  },
  "300": {
    icon: "/images/chains/324.png",
    name: "ZKsync Sepolia Testnet",
    explorer: "https://sepolia.explorer.zksync.io",
  },
  "728126428": {
    icon: "/images/chains/728126428.png",
    name: "Tron Mainnet",
    explorer: "https://tronscan.org",
  },
  "698": {
    icon: "/images/chains/698.png",
    name: "MaTchain",
    explorer: "https://www.matchain.io/",
  },
};

export default networks;
