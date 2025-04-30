import { Config, useConnectorClient } from "wagmi"
import { providers } from "ethers"

export const clientToSigner = (client: any): any => {
    const { account, chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
}

export const useEthersSigner = ({ chainId }: { chainId?: number } = {}): any => {
    const { data: client } = useConnectorClient<Config>({ chainId });
    const signer = client ? clientToSigner(client) : undefined;
    return { signer, chainId: client?.chain.id }
}

export const saveAddress = (address: string | undefined) => {
    if (!address) {
        localStorage.removeItem("userAddress");
        return;
    }
    localStorage.setItem("userAddress", address);
}