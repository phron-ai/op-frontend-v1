import { useMemo } from "react";

import { getAllFunctionsInfo } from "smartcontract-builder/utils/deploy";
import EachFunction from "./eachFunction";
import "./index.scss";

function ContractFunctions(props: any) {
  const { contractInStorage } = props;

  const functions = useMemo(() => {
    return getAllFunctionsInfo(contractInStorage.abi);
  }, []);

  return (
    <div className="contract-functions">
      {functions.map((functionInfo: any, index: number) => (
        <EachFunction
          key={index}
          functionInfo={functionInfo}
          contractInStorage={contractInStorage}
        />
      ))}
    </div>
  );
}

export default ContractFunctions;
