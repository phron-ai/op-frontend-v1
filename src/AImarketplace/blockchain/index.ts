import { ethers } from "ethers";

import OracleMarketplace from "./contracts/OracleMarketplace.json";
import Addresses from "./contracts/Addresses.json";
import { useEthersSigner } from "utils/useSigner";

// Define the type for the addresses
interface Addresses {
    ORACLEMARKETPLACE: any;
}

// Ensure the imported addresses conform to the Addresses interface
const contractAddresses: Addresses = Addresses as Addresses;

export const useMarketplaceContract = () => {
    const { signer } = useEthersSigner();
    const contract = new ethers.Contract(
        contractAddresses.ORACLEMARKETPLACE,
        OracleMarketplace.abi,
        signer
    );
    return {
        marketplaceContract: contract
    };
}