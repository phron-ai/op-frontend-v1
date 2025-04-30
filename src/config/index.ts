// import { QueryClient } from "@tanstack/react-query";
// import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import {
//   arbitrum,
//   arbitrumSepolia,
//   aurora,
//   auroraTestnet,
//   avalanche,
//   base,
//   baseSepolia,
//   berachain,
//   berachainTestnet,
//   boba,
//   bobaSepolia,
//   celo,
//   cronos,
//   cronosTestnet,
//   evmos,
//   evmosTestnet,
//   fantom,
//   fantomTestnet,
//   gnosis,
//   gnosisChiado,
//   harmonyOne,
//   holesky,
//   klaytn,
//   mainnet,
//   metis,
//   moonbeam,
//   omax,
//   optimism,
//   polygon,
//   polygonZkEvm,
//   sepolia,
//   syscoin,
//   telos,
//   telosTestnet,
//   theta,
//   zksync,
//   zksyncSepoliaTestnet,
// } from "viem/chains";
// import {
//   binanceSmartChain,
//   hyperledgerBesu,
//   phronAI,
//   starknet,
//   tron,
// } from "../AImarketplace/blockchain/thirdweb-networks";

// export const config = {
//   server: process.env.REACT_APP_SERVER_URL,
//   deploy: process.env.REACT_APP_DEPLOY_URL,
// };

// export const wagmiConfig = getDefaultConfig({
//   appName: "test project",
//   projectId: "41b65669546aa8e1a8120e3e2c265386",
//   chains: [
//     mainnet,
//     sepolia,
//     arbitrum,
//     arbitrumSepolia,
//     { ...phronAI, iconUrl: "/images/chains/7744.png" },
//     {
//       ...berachain,
//       iconUrl: "/images/chains/80085.png",
//     },
//     {
//       ...berachainTestnet,
//       iconUrl: "/images/chains/80085.png",
//     },

//     {
//       ...tron,
//       iconUrl: "/images/chains/728126428.png",
//     },
//     {
//       ...boba,
//       iconUrl: "/images/chains/1705655850187.png",
//     },
//     {
//       ...bobaSepolia,
//       iconUrl: "/images/chains/1705655850187.png",
//     },
//     {
//       ...aurora,
//       iconUrl: "/images/chains/1313161554.png",
//     },
//     {
//       ...auroraTestnet,
//       iconUrl: "/images/chains/1313161554.png",
//     },
//     avalanche,
//     base,
//     baseSepolia,
//     binanceSmartChain,
//     // celo,
//     cronos,
//     cronosTestnet,
//     {
//       ...evmos,
//       iconUrl: "/images/chains/9001.png",
//     },
//     {
//       ...evmosTestnet,
//       iconUrl: "/images/chains/9001.png",
//     },
//     {
//       ...fantom,
//       iconUrl: "/images/chains/250.png",
//     },
//     {
//       ...fantomTestnet,
//       iconUrl: "/images/chains/250.png",
//     },
//     gnosis,
//     {
//       ...gnosisChiado,
//       iconUrl: "/images/chains/100.jpg",
//     },
//     {
//       ...harmonyOne,
//       iconUrl: "/images/chains/1666600000.png",
//     },
//     hyperledgerBesu,
//     klaytn,
//     {
//       ...metis,
//       iconUrl: "/images/chains/1088.png",
//     },
//     {
//       ...moonbeam,
//       iconUrl: "/images/chains/1284.png",
//     },
//     optimism,
//     {
//       ...polygonZkEvm,
//       iconUrl: "/images/chains/137.png",
//     },
//     polygon,
//     {
//       ...starknet,
//       iconUrl: "/images/chains/2345678.png",
//     },
//     {
//       ...syscoin,
//       iconUrl: "/images/chains/57.png",
//     },
//     {
//       ...telos,
//       iconUrl: "/images/chains/40.png",
//     },
//     {
//       ...telosTestnet,
//       iconUrl: "/images/chains/40.png",
//     },
//     zksync,
//     {
//       ...zksyncSepoliaTestnet,
//       iconUrl: "/images/chains/324.png",
//     },
//     holesky,
//   ],
//   // ssr: true, // If your dApp uses server side rendering (SSR)
// });

// export const queryClient = new QueryClient();

// export default config;

import { QueryClient } from "@tanstack/react-query";
import {
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { trustWallet, okxWallet } from "@rainbow-me/rainbowkit/wallets";
import { Chain } from "viem";

import {
  arbitrum,
  arbitrumSepolia,
  aurora,
  auroraTestnet,
  avalanche,
  base,
  baseSepolia,
  berachain,
  berachainTestnet,
  boba,
  bobaSepolia,
  celo,
  cronos,
  cronosTestnet,
  evmos,
  evmosTestnet,
  fantom,
  fantomTestnet,
  gnosis,
  gnosisChiado,
  harmonyOne,
  holesky,
  klaytn,
  mainnet,
  metis,
  moonbeam,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
  syscoin,
  telos,
  telosTestnet,
  theta,
  zksync,
  zksyncSepoliaTestnet,
  bscTestnet,
  matchain,
  beamTestnet,
} from "viem/chains";

import {
  binanceSmartChain,
  hyperledgerBesu,
  phronAI,
  starknet,
  tron,
  beammainnet,
} from "../AImarketplace/blockchain/thirdweb-networks";

export const config = {
  server: process.env.REACT_APP_SERVER_URL,
  deploy: process.env.REACT_APP_DEPLOY_URL,
};

// export const wagmiConfig = getDefaultConfig({
//   appName: "test project",
//   projectId: "41b65669546aa8e1a8120e3e2c265386",
//   chains: [
//     mainnet,
//     sepolia,
//     arbitrum,
//     arbitrumSepolia,
//     { ...phronAI, iconUrl: "/images/chains/7744.png" },
//     {
//       ...berachain,
//       iconUrl: "/images/chains/80085.png",
//     },
//     {
//       ...berachainTestnet,
//       iconUrl: "/images/chains/80085.png",
//     },

//     {
//       ...tron,
//       iconUrl: "/images/chains/728126428.png",
//     },
//     {
//       ...boba,
//       iconUrl: "/images/chains/1705655850187.png",
//     },
//     {
//       ...bobaSepolia,
//       iconUrl: "/images/chains/1705655850187.png",
//     },
//     {
//       ...aurora,
//       iconUrl: "/images/chains/1313161554.png",
//     },
//     {
//       ...auroraTestnet,
//       iconUrl: "/images/chains/1313161554.png",
//     },
//     avalanche,
//     base,
//     baseSepolia,
//     binanceSmartChain,
//     // celo,
//     cronos,
//     cronosTestnet,
//     {
//       ...evmos,
//       iconUrl: "/images/chains/9001.png",
//     },
//     {
//       ...evmosTestnet,
//       iconUrl: "/images/chains/9001.png",
//     },
//     {
//       ...fantom,
//       iconUrl: "/images/chains/250.png",
//     },
//     {
//       ...fantomTestnet,
//       iconUrl: "/images/chains/250.png",
//     },
//     gnosis,
//     {
//       ...gnosisChiado,
//       iconUrl: "/images/chains/100.jpg",
//     },
//     {
//       ...harmonyOne,
//       iconUrl: "/images/chains/1666600000.png",
//     },
//     hyperledgerBesu,
//     klaytn,
//     {
//       ...metis,
//       iconUrl: "/images/chains/1088.png",
//     },
//     {
//       ...moonbeam,
//       iconUrl: "/images/chains/1284.png",
//     },
//     optimism,
//     {
//       ...polygonZkEvm,
//       iconUrl: "/images/chains/137.png",
//     },
//     polygon,
//     {
//       ...starknet,
//       iconUrl: "/images/chains/2345678.png",
//     },
//     {
//       ...syscoin,
//       iconUrl: "/images/chains/57.png",
//     },
//     {
//       ...telos,
//       iconUrl: "/images/chains/40.png",
//     },
//     {
//       ...telosTestnet,
//       iconUrl: "/images/chains/40.png",
//     },
//     zksync,
//     {
//       ...zksyncSepoliaTestnet,
//       iconUrl: "/images/chains/324.png",
//     },
//     holesky,
// ✅ Ensure the first element is a valid `Chain` object
const chains: any = [
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,

  bscTestnet,
  // phronAI as Chain,
  { ...(phronAI as Chain), iconUrl: "/images/chains/7744.png" },
  { ...(beammainnet as Chain), iconUrl: "/images/chains/4337.png" },
  { ...(beamTestnet as Chain), iconUrl: "/images/chains/4337.png" },
  berachain as Chain,
  berachainTestnet as Chain,
  { ...(tron as Chain), iconUrl: "/images/chains/728126428.png" },
  {
    ...boba,
    iconUrl: "/images/chains/1705655850187.png",
  },
  {
    ...bobaSepolia,
    iconUrl: "/images/chains/1705655850187.png",
  },
  {
    ...aurora,
    iconUrl: "/images/chains/1313161554.png",
  },
  {
    ...auroraTestnet,
    iconUrl: "/images/chains/1313161554.png",
  },
  avalanche,
  base,
  baseSepolia,
  binanceSmartChain as Chain,
  cronos,
  cronosTestnet,
  {
    ...evmos,
    iconUrl: "/images/chains/9001.png",
  },
  {
    ...evmosTestnet,
    iconUrl: "/images/chains/9001.png",
  },
  {
    ...fantom,
    iconUrl: "/images/chains/250.png",
  },
  {
    ...fantomTestnet,
    iconUrl: "/images/chains/250.png",
  },
  gnosis,
  {
    ...gnosisChiado,
    iconUrl: "/images/chains/100.jpg",
  },
  {
    ...harmonyOne,
    iconUrl: "/images/chains/1666600000.png",
  },
  hyperledgerBesu as Chain,
  klaytn,
  {
    ...metis,
    iconUrl: "/images/chains/1088.png",
  },
  {
    ...moonbeam,
    iconUrl: "/images/chains/1284.png",
  },
  optimism,
  {
    ...polygonZkEvm,
    iconUrl: "/images/chains/137.png",
  },
  polygon,
  {
    ...starknet,
    iconUrl: "/images/chains/2345678.png",
  },
  {
    ...syscoin,
    iconUrl: "/images/chains/57.png",
  },
  {
    ...telos,
    iconUrl: "/images/chains/40.png",
  },
  {
    ...telosTestnet,
    iconUrl: "/images/chains/40.png",
  },
  zksync,
  {
    ...zksyncSepoliaTestnet,
    iconUrl: "/images/chains/324.png",
  },
  {
    ...matchain,
    iconUrl: "/images/chains/698.png",
  },
  holesky as Chain,
];

// ✅ Replace with your actual WalletConnect Project ID
const WALLET_CONNECT_PROJECT_ID = "41b65669546aa8e1a8120e3e2c265386";

// ✅ Configure Default Wallets
const { wallets } = getDefaultWallets({
  appName: "test project",
  projectId: WALLET_CONNECT_PROJECT_ID,
});

// ✅ Trust Wallet must be wrapped in a function for `connectorsForWallets`
const trustWalletConnector = trustWallet({
  projectId: WALLET_CONNECT_PROJECT_ID,
});

const okxWalletConnector = okxWallet({ projectId: WALLET_CONNECT_PROJECT_ID });

// ✅ Configure Wallets with Trust Wallet
const connectors = connectorsForWallets(
  [
    ...wallets,
    {
      groupName: "More",
      wallets: [() => trustWalletConnector, () => okxWalletConnector], // ✅ Wrapped in a function to match CreateWalletFn type
    },
  ],
  {
    appName: "test project",
    projectId: WALLET_CONNECT_PROJECT_ID,
  }
);

// ✅ Correctly initialize wagmiConfig
//@ts-ignore
export const wagmiConfig = createConfig({
  connectors,
  chains,
  transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])), // ✅ Correct transport setup
});

export const queryClient = new QueryClient();

export default config;
