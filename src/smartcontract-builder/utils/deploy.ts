import { ethers } from "ethers";

import { validateParameters } from "./";

export const Deploy = async (
  constructorValues: any,
  abi: any,
  bytecode: any,
  signer: any
): Promise<any> => {
  console.log("depoly start!");
  try {
    if (!signer) throw new Error("Signer is not available!");
    if (!validateParameters(constructorValues)) {
      alert("Please enter the information accurately!");
      throw new Error("Please enter the information accurately!");
    }

    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...constructorValues);

    console.log("Deploying contract...");
    await contract.deployed();

    console.log("Contract deployed successfully!", contract.address);
    return contract.address;
  } catch (error: any) {
    console.log("Deploy Error: ", error.message);
  }
};

export const getConstructorInfo = (abi: any) => {
  if (!abi) return [];
  const constructorAbi = abi.find((item: any) => item.type === "constructor");

  if (constructorAbi && constructorAbi.inputs) {
    return constructorAbi.inputs.map((input: any) => ({
      name: input.name,
      type: input.type,
    }));
  }
  return [];
};

export const getFunctionInfo = (abi: any, functionName: string) => {
  const functionAbi = abi.find((item: any) => item.name === functionName);
  let inputInfo = [],
    outputInfo = [];
  if (functionAbi && functionAbi.inputs) {
    inputInfo = functionAbi.inputs.map((input: any) => ({
      name: input.name,
      type: input.type,
    }));
  }
  if (functionAbi && functionAbi.outputs) {
    outputInfo = functionAbi.outputs.map((output: any) => ({
      name: output.name,
      type: output.type,
    }));
  }
  return { inputInfo, outputInfo };
};

export const getAllFunctionsInfo = (abi: any) => {
  const allFunctions = abi.filter((item: any) => item.type === "function");
  const functionInfo = allFunctions.map((functionItem: any) => ({
    name: functionItem.name,
    stateMutability: functionItem.stateMutability,
    inputInfos: functionItem.inputs
      ? functionItem.inputs.map((input: any) => ({
          name: input.name,
          type: input.type,
        }))
      : [],
    outputInfos: functionItem.outputs
      ? functionItem.outputs.map((output: any) => ({
          name: output.name,
          type: output.type,
        }))
      : [],
  }));
  return functionInfo;
};

export const cleanErrorMessage = (error: any): string => {
  if (error.form !== "test") return error.message;
  const lines = error?.message?.split("\n") || [];

  if (lines.length === 0) return "";
  if (error.message.includes("FAIL") || error.message.includes("PASS")) {
    while (
      (!lines[0].startsWith("PASS") || !lines[0].startsWith("FAIL")) &&
      !lines[lines.length - 1].startsWith("Time:")
    ) {
      if (!lines[lines.length - 1].startsWith("Time:")) {
        lines.pop();
      }
      if (!lines[0].startsWith("PASS") && !lines[0].startsWith("FAIL")) {
        lines.shift();
      }
      if (lines.length === 0) return error.message;
    }
  }
  return lines.join("\n");
};
