import { useParams } from "react-router-dom";
import { useEffect } from 'react';

import UseButton from "./component/sharedContractHistory/useButton";
import useContract from 'smartcontract-builder/hooks/contract';
import SharedHistory from './component/sharedContractHistory';
import ResultPage from '../result';
import Steps from '../steps';
import './index.scss';

const ShareContract = () => {
    const { accessToken } = useParams();

    const { isFinalStep, results, getSharedContract } = useContract();

    const fetchContract = async () => {
        await getSharedContract(accessToken as string);
    }

    useEffect(() => {
        fetchContract();
    }, []);

    return (
        <div className="shared-container px-4 pb-4 md:px-32">
            <Steps />
            <UseButton />
            {isFinalStep ? <ResultPage results={results} /> : <SharedHistory />}
        </div>
    );
};

export default ShareContract;