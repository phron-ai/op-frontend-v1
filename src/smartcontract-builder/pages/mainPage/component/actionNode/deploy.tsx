//@ts-nocheck
import { useEffect, useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import { useEthersSigner } from "../../../../../utils/useSigner";
import { Button } from "../../../../../components/ui/button";
import useToDeployContract from "../../../../hooks/deploy";
import useContracts from "../../../../hooks/contracts";
import useContract from "../../../../hooks/contract";

import { Deploy } from "smartcontract-builder/utils/deploy";
import ConstructorInputs from "./constructorInputs";
import { Badge } from "components/ui/badge";
import ErrorPanel from "./errorPanel";

function DeployContract(props: any) {
  const { constructorInfo, abi, bytecode, setIsDeployed, name, contractName } =
    props;
  const { signer, chainId } = useEthersSigner();

  const {
    testContract,
    addDeployedContract,
    sendMessage,
    approve,
    currentContract,
    testCode,
  } = useContract();
  const { saveToLocalStorage } = useToDeployContract();
  const { isLoading, setIsLoading } = useContracts();

  const [constructorValues, setConstructorValues] = useState(
    Array(constructorInfo.length).fill("")
  );
  const [result, setResult] = useState<any>({ form: "test", message: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    if (!testCode) setIsGenerated(false);
    else setIsGenerated(true);
  }, [testCode]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...constructorValues];
    newValues[index] = value;
    setConstructorValues(newValues);
  };

  const deploy = async () => {
    try {
      console.log("constructorValues", constructorValues);
      const address = await Deploy(constructorValues, abi, bytecode, signer);
      saveToLocalStorage({
        address,
        name: currentContract.name,
        abi,
        chainId,
        constructorValues,
        contractName,
       // isAudit: false,
        auditReportStatus: "not-initialized"
      });
      setIsDeployed(true);
      console.log(address);
      const name = currentContract.name;
      if (address) {
        addDeployedContract(
          address,
          name,
          abi,
          chainId,
          currentContract.id,
          contractName,
          constructorValues
        );
      }
    } catch (error: any) {
      console.log("Deploy Error: ", error.message);
      setIsDeployed(false);
    }
  };

  const runTest = async () => {
    console.log("Running Tests...");
    try {
      setResult({ form: "test", message: "Running tests..." });
      setIsLoading(true);
      setIsModalOpen(true);
      const _result = await testContract();
      if (!_result) throw new Error("Server Error!");
      setResult({
        form: "test",
        message: _result.success ? _result.output : _result.error,
      });
    } catch (error: any) {
      console.log("Test Error: ", error.message);
    } finally {
      setIsLoading(false);
      setIsGenerated(false);
    }
  };

  const generateTestScript = async (message: string, stepId?: number) => {
    console.log("Generating TestScript...");
    try {
      setIsModalOpen(true);
      const reply = await sendMessage(currentContract._id, message, stepId);
      if (!reply) return false;
      await approve(true);

      setIsGenerated(true);
      setIsModalOpen(false);
      console.log("TestScript is generated!");
      return true;
    } catch (error: any) {
      console.log("Test Error: ", error.message);
      return false;
    }
  };

  return (
    <div className="deploy-contract w-full max-w-[650px] mx-auto py-[20px] md:p-[20px] text-black">
      <div className="deploy-panel">
        <h2 className="deploy-title text-lg md:text-[24px]">
          Contract Ready to Deploy
        </h2>
        <div className="deploy-content">
          <ConstructorInputs
            constructorInfo={constructorInfo}
            onInputChange={handleInputChange}
          />
          <div className="button-group flex-col md:flex-row md:mt-[40px]">
            <Button
              className="h-10"
              onClick={deploy}
              // disabled={Boolean(bytecode)}
            >
              <span className="button-icon">🚀</span>
              Deploy Contract
            </Button>
            {/* <Button onClick={onVerifyContract} disabled={verifyLoading}>
              {verifyLoading ? <Loader2 className="w-4 h-4 mr-2" /> : null}
              Verify Contract
            </Button> */}
            {isLoading ? (
              <Button className="testing-button w-full" disabled>
                <Loader className="button-icon animate-spin" size={18} />
              </Button>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <Button
                  onClick={() =>
                    !isGenerated ? generateTestScript("test") : runTest()
                  }
                  variant="outline"
                  className="h-10 w-full"
                  disabled
                  // className="test-button"
                >
                  <span className="button-icon">🧪</span>
                  {isGenerated ? "Run Tests" : "Generate TestScript"}
                </Button>
                <Badge
                  variant="yellow"
                  className="-mt-3 -mr-3 z-10 select-none"
                >
                  Coming Soon
                </Badge>
              </div>
            )}
          </div>
        </div>
        <ErrorPanel
          errors={result}
          isModalOpen={isModalOpen}
          generateTestScript={generateTestScript}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
}

export default DeployContract;
