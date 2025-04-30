import { useAccount } from "wagmi";
import { Contract } from "ethers";

import serverProvider from "smartcontract-builder/service/server";
import { useEthersSigner } from "utils/useSigner";
import useContract from "./contract";
import { checkError } from "utils";

const useToDeployContract = () => {
  const { signer } = useEthersSigner();
  const account = useAccount();

  const { currentContract, contractCode } = useContract();

  const saveToLocalStorage = ({
    address,
    name,
    abi,
    chainId,
    constructorValues,
    contractName,
    auditReportStatus,
  }: any) => {
    try {
      console.log("saveToLocalStorage", address, name, abi, chainId);
      if (!address || !abi || !chainId || !constructorValues || !name)
        throw new Error("Invalid Parameters");
      const contractToDeploy = {
        userAddress: account.address,
        name,
        address,
        abi,
        chainId,
        constructorValues,
        contractName,
        timestamp: new Date().toISOString(),
        isVerified: false,
        isPublished: false,
        isAudit: false,
        auditReportStatus: auditReportStatus,
      };
      const _deployedContracts: any = localStorage.getItem(currentContract.id);
      let deployedContracts: any = JSON.parse(_deployedContracts);

      if (!deployedContracts) {
        localStorage.setItem(
          currentContract.id,
          JSON.stringify([contractToDeploy])
        );
      } else {
        deployedContracts.push(contractToDeploy);
        localStorage.setItem(
          currentContract.id,
          JSON.stringify(deployedContracts)
        );
      }
      return contractToDeploy;
    } catch (error: any) {
      console.log("saveToLocalStorage Error!", error.message);
    }
  };

  const updateAuditStatusToLocalStorage = ({
    address,
    auditReportStatus,
  }: any) => {
    try {
      if (!address || !auditReportStatus) throw new Error("Invalid Parameters");

      const _deployedContracts: any = localStorage.getItem(currentContract.id);
      let deployedContracts: any = JSON.parse(_deployedContracts);

      deployedContracts = deployedContracts.map((contract) => {
        if (contract.address === address) {
          return {
            ...contract,
            auditReportStatus,
          };
        }
        return contract;
      });

      console.log("updateAuditStatusToLocalStorage", deployedContracts);

      localStorage.setItem(
        currentContract.id,
        JSON.stringify(deployedContracts)
      );

      return;
    } catch (error: any) {
      console.log("saveToLocalStorage Error!", error.message);
    }
  };

  const deleteContract = (id: any) => {
    try {
      if (!window.confirm("Do you want delete this contract?")) return;
      const _deployedContracts: any = localStorage.getItem(currentContract.id);
      const deployedContracts = JSON.parse(_deployedContracts);
      deployedContracts.splice(id, 1);
      localStorage.setItem(
        currentContract.id,
        JSON.stringify(deployedContracts)
      );
      return deployedContracts;
    } catch (error: any) {
      console.log("deleteContract Error!", error.message);
    }
  };

  const verifyContract = async (address: any) => {
    try {
      //  if (!window.confirm("Do you want delete this contract?")) return;
      const _deployedContracts: any = localStorage.getItem(currentContract.id);
      const __deployedContracts = JSON.parse(_deployedContracts);

      const deployedContracts = __deployedContracts.filter(
        (cont) => cont.address === address
      );

      const remainingDeployedContracts = __deployedContracts.filter(
        (cont) => cont.address !== address
      );

      //console.log("remainingDeployedContracts", remainingDeployedContracts);

      const resp = await serverProvider.verifyContract({
        contractAddress: deployedContracts[0]?.address,
        contractCode: contractCode,
        abi: deployedContracts[0]?.abi,
        chainId: deployedContracts[0]?.chainId,
        constructorArgs: deployedContracts[0].constructorValues
          ? deployedContracts[0]?.constructorValues
          : [],
      });

      console.log("verify resp", resp);
      if (resp.success) {
        localStorage.setItem(
          currentContract.id,
          JSON.stringify([
            ...remainingDeployedContracts,
            { ...deployedContracts[0], isVerified: true },
          ])
        );
        await serverProvider.updateDeployedContract({
          address: deployedContracts[0]?.address,
          isVerified: true,
        });
      }
      // deployedContracts.splice(id, 1);
      // localStorage.setItem(
      //   currentContract.id,
      //   JSON.stringify(deployedContracts)
      // );
      return resp;
    } catch (error: any) {
      console.log("verifyContract Error!", error.message);
    }
  };

  const auditContract = async (address: any) => {
    try {
      console.log("trigger audit", address);
      const resp = await serverProvider.auditContract({
        contractAddress: address,
      });

      console.log("verify resp", resp);
      if (resp.success) {
        // localStorage.setItem(
        //   currentContract.id,
        //   JSON.stringify([
        //     ...remainingDeployedContracts,
        //     { ...deployedContracts[0], isVerified: true },
        //   ])
        // );
        // await serverProvider.updateDeployedContract({
        //   address: deployedContracts[0]?.address,
        //   isVerified: true,
        // });
      }

      return resp;
    } catch (error: any) {
      console.log("verifyContract Error!", error.message);
    }
  };

  const getDeployedContracts = async (): Promise<any> => {
    try {
      const _deployedContracts: any = localStorage.getItem(currentContract.id);

      let deployedContracts = JSON.parse(_deployedContracts);
      if (!deployedContracts) {
        deployedContracts = await serverProvider.getDeployedContract(
          currentContract.id
        );
        if (!deployedContracts) return [];
      }

      // return deployedContracts.reverse().filter((item: any, index: any) => {
      //   if (!item.address) {
      //     return false;
      //   }

      //   return {
      //     ...item,
      //     contract: new Contract(item.address, item.abi, signer),
      //   };
      // });

      // return [];
      return deployedContracts.reverse().map((item: any) => ({
        ...item,
        contract: new Contract(item.address, item.abi, signer),
      }));
    } catch (error: any) {
      console.log("getDeployedContracts Error!", error);
      return [];
    }
  };

  return {
    saveToLocalStorage,
    getDeployedContracts,
    deleteContract,
    verifyContract,
    auditContract,
    updateAuditStatusToLocalStorage,
  };
};

export default useToDeployContract;
