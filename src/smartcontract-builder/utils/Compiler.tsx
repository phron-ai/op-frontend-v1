//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { getConstructorInfo } from "smartcontract-builder/utils/deploy";
import useContracts from "smartcontract-builder/hooks/contracts";
import useContract from "smartcontract-builder/hooks/contract";
import DeployedContracts from "../../smartcontract-builder/pages/mainPage/component/actionNode/contractFunctions";
import DeployContract from "../../smartcontract-builder/pages/mainPage/component/actionNode/deploy";
import ErrorPanel from "../../smartcontract-builder/pages/mainPage/component/actionNode/errorPanel";
import "../../smartcontract-builder/pages/mainPage/component/actionNode/index.scss";
import useDisclosure from "hooks/use-disclosure";
import CreateAgent from "components/CreateAgent";
import { ScrollArea } from "components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Button } from "components/ui/button";
import axios from "axios";
import serverProvider from "smartcontract-builder/service/server";

function ActionNodeNew() {
  const {
    contractCode,
    compileContract,
    verifyContract,
    verifyLoading,
    aiAgentSuggester,
    agentLoading,
    useCases,
  } = useContract();
  const { setIsLoading } = useContracts();

  const [error, setError] = useState<any>({ form: "compile", message: "" });
  const [constructorInfo, setConstructorInfo] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [bytecode, setBytecode] = useState<string>("");
  const [abi, setAbi] = useState<any>(null);

  const { isOpen, onClose, onOpen, onToggle } = useDisclosure();

  const compile = async () => {
    try {
      console.log("compile...");
      setError({ form: "compile", message: "" });
      setIsModalOpen(true);
      setIsLoading(true);
      const result = await compileContract();

      if (!result) throw new Error("Server Error!");
      if (result.error) {
        setError({
          form: "compile",
          message: result.error,
        });
        return;
      }
      setAbi(result.abi);
      setBytecode(result.bytecode);
      setConstructorInfo(getConstructorInfo(result.abi));
      setIsModalOpen(false);
    } catch (error: any) {
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
      console.log("compile finished!");
    }
  };

  const onVerifyContract = async (address: string) => {
    try {
      await verifyContract(contractCode, abi, address);
    } catch (error) {
      console.log("onVerifyContract ERROR", error);
    }
  };

  const onAIAgentsSuggesters = async (
    _selectContractAddress: string,
    _currentContractChainId: string,
    _abi: string
  ) => {
    try {
      await aiAgentSuggester(
        contractCode,
        _selectContractAddress,
        _currentContractChainId,
        _abi
      );
    } catch (error) {
      console.log("onAIAgentsSuggesters ERROR", error);
    }
  };

  useEffect(() => {
    compile();
  }, []);

  useEffect(() => {
    if (useCases) {
      onOpen();
    }
  }, [useCases]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onToggle}>
        <DialogContent
          className="max-w-5xl"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <ScrollArea className="h-[calc(100vh-100px)] overflow-auto">
            <CreateAgent useCases={useCases} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col action-node">
        <ErrorPanel
          errors={error}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        {bytecode && (
          <DeployContract
            constructorInfo={constructorInfo}
            abi={abi}
            bytecode={bytecode}
            setIsDeployed={setIsDeployed}
          />
        )}
        {/* <div className="flex items-center justify-center">
          <Button
            onClick={onAIAgentsSuggesters}
            disabled={agentLoading}
            className=""
          >
            {agentLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
            Create AI Agents
          </Button>
        </div> */}
        {bytecode && (
          <DeployedContracts
            isDeployed={isDeployed}
            onVerifyContract={onVerifyContract}
            verifyLoading={verifyLoading}
            onAIAgentsSuggesters={onAIAgentsSuggesters}
            agentLoading={agentLoading}
          />
        )}
      </div>
    </>

    //open a branch
    // )}
    // <DeployedContracts isDeployed={isDeployed} />
    // </div>
  );
}

export default ActionNodeNew;
