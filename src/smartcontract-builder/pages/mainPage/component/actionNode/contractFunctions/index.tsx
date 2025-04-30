//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Close,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Delete,
  Verified,
} from "@mui/icons-material";
import { Copy, CopyCheck, Loader, Loader2, ShieldCheck } from "lucide-react";
import useToDeployContract from "smartcontract-builder/hooks/deploy";
import { Button } from "components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import ContractFunctions from "./functions";
import { copyToClipboard } from "utils";
import { Link } from "react-router-dom";
import { Switch } from "../../../../../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../../components/ui/dialog";
import serverProvider from "../../../../../../smartcontract-builder/service/server";
import { toast } from "react-toastify";

function DeployedContracts({
  isDeployed,
  onVerifyContract,
  verifyLoading,
  onAIAgentsSuggesters,
  agentLoading,
}) {
  const { getDeployedContracts } = useToDeployContract();

  const [deployedContracts, setDeployedContracts] = useState<
    DeployedContract[]
  >([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const resp = await getDeployedContracts();
        setDeployedContracts(resp || []);
      } catch (error) {
        console.error("Error fetching deployed contracts:", error);
      }
    };
    fetchContracts();
  }, [isDeployed]);

  return (
    <>
      {deployedContracts.length > 0 && (
        <div className="deployed-contracts w-full max-w-[600px] mx-auto">
          <h2 className="mb-4 font-bold text-lg pt-2">Deployed Contract(s)</h2>
          <div className="deployed-contract-list">
            {deployedContracts.map((contract, index) => (
              <EachContract
                contractInStorage={contract}
                key={index}
                index={index}
                onVerifyContract={onVerifyContract}
                verifyLoading={verifyLoading}
                onAIAgentsSuggesters={onAIAgentsSuggesters}
                agentLoading={agentLoading}
                address={contract.address}
                auditReportStatus={contract.auditReportStatus}
                isAudit={contract.isAudit}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const EachContract = (props) => {
  const {
    contractInStorage,
    index,
    address,
    agentLoading,
    auditReportStatus,
    isAudit,
  } = props;

  const [selectedContract, setSelectedContract] = useState(false);
  const [isVerifiedContract, setIsVerified] = useState(false);
  // const [isAudit, setIsAudit] = useState(false);
  const [auditStatus, setAuditStatus] = useState("not-initialized");
  const [isAuditLoading, setIsAuditLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    deleteContract,
    verifyContract,
    getDeployedContracts,
    auditContract,
    saveToLocalStorage,
    updateAuditStatusToLocalStorage,
  } = useToDeployContract();

  // ---------------------
  // isPublished Setup
  // ---------------------
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingState, setPendingState] = useState(false);

  // For localStorage key
  const localStorageKey = `isPublished_${contractInStorage.address}`;

  // ---------------------
  // On Mount: Load from DB or localStorage
  // ---------------------
  useEffect(() => {
    // Set verified status from DB
    setIsVerified(contractInStorage.isVerified);
    setAuditStatus(contractInStorage.auditReportStatus);

    // Try reading localStorage for isPublished
    const storedVal = localStorage.getItem(localStorageKey);

    if (storedVal !== null) {
      // Attempt to parse JSON
      try {
        const parsedVal = JSON.parse(storedVal);
        setIsPublished(parsedVal);
      } catch (error) {
        console.error("Error parsing localStorage value:", error);
        // fallback to DB's isPublished
        setIsPublished(!!contractInStorage.isPublished);
        // store it properly
        localStorage.setItem(
          localStorageKey,
          JSON.stringify(!!contractInStorage.isPublished)
        );
      }
    } else {
      // If nothing in localStorage, fallback to DB
      setIsPublished(!!contractInStorage.isPublished);
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(!!contractInStorage.isPublished)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contractInStorage.isVerified,
    contractInStorage.isPublished,
    contractInStorage.address,
    contractInStorage.auditReportStatus,
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // ---------------------
  // UI Helpers
  // ---------------------
  const selectContract = () => setSelectedContract((prev) => !prev);

  const copyAddress = () => {
    try {
      navigator.clipboard.writeText(contractInStorage.address);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error: any) {
      console.log("Error copying address:", error.message);
    }
  };

  // ---------------------
  // Verification
  // ---------------------
  const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const resp = await verifyContract(address);
      setIsVerified(resp?.success);
    } catch (error) {
      console.error("Contract verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsAuditLoading(true);
    try {
      const resp = await auditContract(address);

      if (resp.success) {
        console.log("resp success");
        updateAuditStatusToLocalStorage({
          address,
          auditReportStatus: "pending",
        });
        setAuditStatus("pending");
      }
      //  setIsAudit(resp?.success);
    } catch (error) {
      console.error("Contract verification failed:", error);
    } finally {
      setIsAuditLoading(false);
    }
  };

  // ---------------------
  // Publish / Unpublish
  // ---------------------
  const updatePublishAgents = async (publishStatus: boolean) => {
    try {
      setIsLoading(true);
      // const resp = await getDeployedContracts();
      // console.log(resp || []);
      const response = await serverProvider.updatePublishedAgents({
        isPublished: publishStatus,
        address: contractInStorage.address,
        name: getDeployedContracts.name,
      });
      console.log(response);

      if (response.status === 200) {
        toast.success("Published status updated!");
      }
    } catch (error) {
      console.error("Failed to update publish status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleClick = (checked: boolean) => {
    setIsPublished(checked);
    setPendingState(checked);

    // Update localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(checked));
    // Then update server
    updatePublishAgents(checked);
  };

  const cancelChange = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="deployed-contract">
      <div className="flex mb-5 items-center sm:gap-2 md:gap-6 justify-center">
        {selectedContract ? (
          <KeyboardArrowDown
            className="icon cursor-pointer"
            onClick={selectContract}
          />
        ) : (
          <KeyboardArrowRight
            className="icon cursor-pointer"
            onClick={selectContract}
          />
        )}

        {/* Address / Copy */}
        <Button
          className="px-5"
          variant="outline"
          onClick={() =>
            copyToClipboard(
              contractInStorage.address,
              setCopied,
              "Contract address is copied to clipboard"
            )
          }
        >
          <span className="text-xs md:text-sm">
            Address: {contractInStorage.address.substring(0, 6)}...
            {contractInStorage.address.substring(36, 42)}
          </span>
          {!copied ? (
            <span
              onClick={(e) => {
                copyToClipboard(
                  contractInStorage.address,
                  setCopied,
                  "Contract address is copied to clipboard"
                );
                e.stopPropagation();
              }}
            >
              <Copy className="icon mr-1" />
            </span>
          ) : (
            <CopyCheck className="icon mr-1" />
          )}
        </Button>

        {/* Delete */}
        <span
          onClick={(e) => {
            deleteContract(index);
            e.stopPropagation();
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Delete className="w-3 h-3 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Contract</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>

        {/* Verify */}
        <span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {isVerifiedContract ? (
                  <Verified className="w-3 h-3 text-green-500" />
                ) : (
                  <button
                    onClick={handleVerify}
                    disabled={isLoading || isVerifiedContract}
                  >
                    {isLoading ? (
                      <Loader className="w-5 h-5 text-[#321b7a] animate-spin" />
                    ) : (
                      <Verified className="w-3 h-3 text-gray-500" />
                    )}
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {isLoading ? (
                  <p>Verifying...</p>
                ) : isVerifiedContract ? (
                  <p>Verified</p>
                ) : (
                  <p>Verify Contract</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>

        {/* Publish Toggle */}
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Switch
                  checked={isPublished}
                  onCheckedChange={handleToggleClick}
                  className="data-[state=checked]:bg-green-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                {isPublished ? "Published" : "Unpublished"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {isAudit ? (
                  <ShieldCheck color="green" />
                ) : auditStatus === "not-initialized" ? (
                  <button onClick={handleAudit} disabled={isAuditLoading}>
                    {isAuditLoading ? (
                      <Loader className="w-5 h-5 text-[#321b7a] animate-spin" />
                    ) : (
                      <ShieldCheck color="gray" />
                    )}
                  </button>
                ) : (
                  <ShieldCheck color="orange" />
                )}

                {/* <Switch
                  checked={isPublished}
                  onCheckedChange={handleToggleClick}
                  className="data-[state=checked]:bg-green-500"
                /> */}
              </TooltipTrigger>
              <TooltipContent>
                {auditStatus === "not-initialized" ? "Audit" : auditStatus}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* AI Manage Button */}
      <div className="flex justify-center mb-2">
        <Button className="rounded-lg">
          <Link
            to={`/contract-agent/${contractInStorage.address}`}
            target="_blank"
          >
            {agentLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
            Let AI Manage your contract
          </Link>
        </Button>
      </div>

      {/* Confirmation Dialog (not currently used but left intact) */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingState ? "publish" : "unpublish"}{" "}
              this item?
              {pendingState
                ? " This will make it visible to the public."
                : " This will hide it from the public."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelChange}>
              Cancel
            </Button>
            <Button variant={pendingState ? "default" : "secondary"}>
              {pendingState ? "Publish" : "Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expand contract functions if selected */}
      {selectedContract && (
        <ContractFunctions
          contractInStorage={contractInStorage}
          abi={contractInStorage.abi}
        />
      )}
    </div>
  );
};

export default DeployedContracts;
