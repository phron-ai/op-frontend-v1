//@ts-nocheck
import { FileText, Plus } from "lucide-react";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom";

// import ToTopButton from "smartcontract-builder/components/totop-button";
import useContracts from "smartcontract-builder/hooks/contracts";
import { ContractContext } from "smartcontract-builder/context";
import useContract from "smartcontract-builder/hooks/contract";
import useCost from "smartcontract-builder/hooks/cost";
import UpgradeModal from "./component/upgrade";
import { Button } from "components/ui/button";
import ResultPage from "./component/result";
import Steps from "./component/steps";
import Chat from "./component/chat";
import "./index.scss";
import { ContractDisplay } from "./contractPannel";
// import Compiler from "smartcontract-builder/utils/Compiler";
// import ActionNode from "./component/actionNode";
// import useDisclosure from "hooks/use-disclosure";

const MainPage = () => {
  const { state } = useContext(ContractContext) as ContractContextValue;
  const { upgradeModalVisible, closeUpgradeModal } = useCost();
  const { isFinalStep, results, stepId, contractCode } = useContract();

  const { contracts } = useContracts();

  const content = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const updateMargin = () => {
  //     const sidebar = document.getElementById("agent-sidebar");

  //     // if (sidebar && content.current) {
  //     //   content.current.style.marginLeft = `${sidebar.offsetWidth}px`;
  //     // }
  //   };

  //   updateMargin();

  //   window.addEventListener("resize", updateMargin);

  //   return () => {
  //     window.removeEventListener("resize", updateMargin);
  //   };
  // }, []);
  // const {
  //   // contractCode,
  //   compileContract,
  //   verifyContract,
  //   // verifyLoading,
  //   aiAgentSuggester,
  //   // agentLoading,
  //   useCases,
  // } = useContract();
  // const { setIsLoading } = useContracts();

  // const [error, setError] = useState<any>({ form: "compile", message: "" });
  // const [constructorInfo, setConstructorInfo] = useState<any[]>([]);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // // const [isDeployed, setIsDeployed] = useState<boolean>(false);
  // const [bytecode, setBytecode] = useState<string>("");
  // const [abi, setAbi] = useState<any>(null);

  // const { isOpen, onClose, onOpen, onToggle } = useDisclosure();

  // const compile = async () => {
  //   try {
  //     console.log("compile...");
  //     setError({ form: "compile", message: "" });
  //     setIsModalOpen(true);
  //     setIsLoading(true);
  //     const result = await compileContract();

  //     if (!result) throw new Error("Server Error!");
  //     if (result.error) {
  //       setError({
  //         form: "compile",
  //         message: result.error,
  //       });
  //       return;
  //     }
  //     setAbi(result.abi);
  //     setBytecode(result.bytecode);
  //     setConstructorInfo(getConstructorInfo(result.abi));
  //     setIsModalOpen(false);
  //   } catch (error: any) {
  //     setIsModalOpen(false);
  //   } finally {
  //     setIsLoading(false);
  //     console.log("compile finished!");
  //   }
  // };

  // const onVerifyContract = async (address: string) => {
  //   try {
  //     await verifyContract(contractCode, abi, address);
  //   } catch (error) {
  //     console.log("onVerifyContract ERROR", error);
  //   }
  // };

  // const onAIAgentsSuggesters = async (
  //   _selectContractAddress: string,
  //   _currentContractChainId: string,
  //   _abi: string
  // ) => {
  //   try {
  //     await aiAgentSuggester(
  //       contractCode,
  //       _selectContractAddress,
  //       _currentContractChainId,
  //       _abi
  //     );
  //   } catch (error) {
  //     console.log("onAIAgentsSuggesters ERROR", error);
  //   }
  // };

  // useEffect(() => {
  //   compile();
  // }, []);

  // useEffect(() => {
  //   if (useCases) {
  //     onOpen();
  //   }
  // }, [useCases]);
  return (
    <div className="w-full ">
      {/* <ToTopButton /> */}
      {upgradeModalVisible && (
        <UpgradeModal visible={true} onClose={closeUpgradeModal} />
      )}
      <div className="max-w-[1390px] mx-auto">
        <div className="flex">
          <div
            ref={content}
            className="relative h-full flex flex-col justify-between md:pl-4 w-full"
          >
            {state.isLoading === false && contracts.length === 0 ? (
              <div className="max-w-6xl mx-auto space-y-6 mt-10 shadow-lg rounded-lg">
                <div className="border rounded-lg p-8 text-center bg-card/50">
                  <div className="max-w-sm mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">No Contracts Found</h3>
                    <p className="text-muted-foreground">
                      Get started by creating your first contract
                    </p>
                    <Button className="gap-2" asChild>
                      <Link to="/">
                        <Plus className="h-4 w-4" />
                        Add New Contract
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex gap-4">
                  { (
                    <div className="flex flex-col justify-between">
                      {/* <div className="bg-black  w-full  sticky top-[100px] max-h-[540px] rounded-[20px] overflow-hidden">
                        <div>
                          <SyntaxHighlighter
                            language="solidity"
                            style={vscDarkPlus}
                          >
                            {contractCode}
                          </SyntaxHighlighter>
                        </div>
                      </div> */}
                      <div className="w-full max-w-[360px] min-w-[360px] xl:max-w-[500px] xl:min-w-[500px] sticky mt-[10px] top-[100px] hidden lg:block">
                        <ContractDisplay contractCode={contractCode} />
                        <div>
                          {/* <Button>Deploy</Button> */}
                          {/* <Compiler /> */}
                          {/* <ActionNode /> */}
                        </div>
                      </div>
                    </div>
                  ) }

                  <div className="w-full">
                    <Steps />
                    {isFinalStep ? <ResultPage results={results} /> : <Chat />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
