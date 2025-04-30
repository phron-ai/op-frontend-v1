import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatInterface } from "./ChatInterface";
const fetchCurrentContract = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/contract/deployed/${id}`
    );

    const data = await res.json();

    return data.contract;
  } catch (error) {
    console.log(error);
  }
};

export default function ContractAgent() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<any>(null);

  console.log("contract_address", params.contract_address);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (params.contract_address) {
        const _contract = await fetchCurrentContract(params.contract_address);
        setContract(_contract);
      }
      setLoading(false);
    })();
  }, []);

  console.log("loading", loading);

  if (!params.contract_address) {
    return null;
  }

  if (loading) {
    return <>loading...</>;
  }

  return !contract ? null : (
    <ChatInterface
      address={contract.address}
      chain_id={contract.chainId}
      functions={extractFunctionsFromAbi(JSON.parse(contract.abi))}
      abis={contract.abi}
    />
  );
}

function extractFunctionsFromAbi(abi: any[]): any[] {
  return abi
    .filter((item: any) => item.type === "function")
    .map((fn: any) => ({
      name: fn.name,
      inputs: fn.inputs.map((input: any) => ({
        name: input.name,
        type: input.type,
      })),
      stateMutability: fn.stateMutability,
    }));
}
