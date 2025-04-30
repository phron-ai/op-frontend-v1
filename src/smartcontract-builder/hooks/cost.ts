import { useContext } from 'react';

import serverProvider from 'smartcontract-builder/service/server';
import { ContractContext } from 'smartcontract-builder/context';
import { useEthersSigner } from 'utils/useSigner';
import { showNotification } from 'utils';

const useCost = () => {
    const signer: any = useEthersSigner();

    const { state, update } = useContext(ContractContext) as ContractContextValue;

    const reduceTokens = async (token: number) => {
        try {
            const respose = await serverProvider.reduceTokens(token);
            return respose.remainingTokens;
        } catch (error: any) {
            console.log("reduceTokens-Error:", error.message)
        }
    }

    const getToken = async () => {
        try {
            const response = await serverProvider.getToken();
            if (!response) return;
            // let token = response.remainingTokens;
        } catch (error: any) {
            console.log("getToken-Error:", error.message)
        }
    }

    const subscribeToken = async (id: string) => {
        try {
            await transferEther(id);
            const response = await serverProvider.subscribeToken(id);
            if (response.success === true) showNotification("Subscribe Success", response.message);
            await getToken();
        } catch (error: any) {
            console.log("subscribe-Error:", error.message)
        }
    }

    const transferEther = async (id: string) => {
        try {
            console.log("transfer start!");
            // if (!process.env.REACT_APP_AMOUNT) return;
            // const tx = {
            //     to: process.env.REACT_APP_RECIPIENT,
            //     value: ethers.utils.parseEther(process.env.REACT_APP_AMOUNT),
            // };

            // console.log(JSON.stringify(signer, null, 2));
            // const transactionResponse = await signer.sendTransaction(tx);

            // await transactionResponse.wait();



            // const tx = {
            //     to: process.env.REACT_APP_RECIPIENT,
            //     value: priceValue(id),
            // }

            // const transactionResponse = await signer.sendTransaction(tx);

            // await transactionResponse.wait();

            showNotification('Transaction successful!');
        } catch (error: any) {
            console.error('Transaction failed:' + error.message);
            throw new Error(error.message);
        }
    };

    const reduceToken = async (token: number) => {
        update({ total_token: state.total_token - token });
    }

    const openUpgradeModal = () => {
        update({ isUpgradeModalVisible: true });
    }

    const closeUpgradeModal = () => {
        update({ isUpgradeModalVisible: false });
    }

    return {
        upgradeModalVisible: state.isUpgradeModalVisible,
        subscribeToken,
        getToken,
        reduceTokens,
        openUpgradeModal,
        closeUpgradeModal,
        reduceToken
    }
}

export default useCost;