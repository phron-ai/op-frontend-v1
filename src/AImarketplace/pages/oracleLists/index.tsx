//@ts-nocheck
import OracleHeader from "AImarketplace/components/header";
import useOracles from "AImarketplace/hooks/useOracles";
import Oracle from "./components/oracle";
import "./index.scss";
import serverProvider from "../../../smartcontract-builder/service/server";
import useContracts from "smartcontract-builder/hooks/contracts";
import useToDeployContract from "smartcontract-builder/hooks/deploy";
import { useEffect, useState } from "react";
import ContractCard from "./components/agents/Cards";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/ui/accordion";
import { Badge } from "components/ui/badge";
import { ExternalLink, Copy } from "lucide-react";
import networks from "config/chains";
import { Link } from "react-router-dom";
import { inferFromABI } from "./components/agents/inferFromAbi";
import NFTCard from "./components/agents/AgentCards";
import { fetchDeployedContracts } from "./components/agents/FetchdeployedContracts";

const OracleList = () => {
  const { oracles }: { oracles: Oracle[] } = useOracles();

  const [data, setData] = useState([]);
  const [agentsDetails, setAgentsDetails] = useState<any>({
    contractName: "",
    useCases: "",
  });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const resp = await serverProvider.GetAgents();
        console.log(resp);
        if (resp.data.address) {
          const _contract = await fetchCurrentContract(resp.data.address);
          setContract(_contract);
        }
        const loadContracts = async () => {
          const deployed = await fetchDeployedContracts();
          console.log(deployed);
        };

        loadContracts();
        setData(resp.data);
        // const enriched = await inferFromABI(resp.data.abi);

        // const updatedContract = {
        //   contractName: enriched.name,
        //   useCases: enriched.useCases,
        // };
        setAgentsDetails(updatedContract);
      } catch (error) {
        console.error("Error fetching deployed contracts:", error);
      }
    };
    fetchContracts();
  }, []);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const formatMongoDate = (dateStr) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));
  return (
    <div className="w-full">
      <main className="max-w-[1390px] mx-auto px-4 xl:px-0 pt-6">
        <OracleHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6 gap-4">
          {/* {oracles.map((oracle: Oracle, index: number) => (
            <Oracle oracle={oracle} key={index} />
          ))} */}
          {data.map((agents, index) => (
            <NFTCard
              title={agents?.name}
              deployedBy={truncateAddress(agents?.userAddress)}
              contract={truncateAddress(agents?.address)}
              agentName={agents?.name}
              // agentRole="Primary Minter"
              deploymentDate={formatMongoDate(agents?.createdAt)}
              verified={agents?.isVerified}
              chainId={agents?.chainId}
              link={agents?.address}
            />
          ))}
          {/* {data.map((contract, index) => (
            <>
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      {agentsDetails.contractName}
                      MintableNFT
                    </CardTitle>
                    <Badge variant="outline">contract.type</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>Deployed by:</span>
                    <span className="font-mono">
                      {truncateAddress(contract?.userAddress)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(contract.userAddress)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {copied ? (
                        <span className="text-green-500 text-xs">Copied!</span>
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Contract:</span>
                    <span className="font-mono">
                      {truncateAddress(contract.address)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(contract.address)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <a
                      href={
                        networks[contract?.chainId].explorer
                          ? `${networks[contract.chainId]?.explorer}/address/${
                              contract.address
                            }#code`
                          : "/"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                    <h4 className="text-sm font-medium mb-2">Use Cases</h4>
                    <ul className="text-sm space-y-1">
                      {agentsDetails.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                      {agentsDetails.useCases}
                    </ul>
                  </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                      Contract Functions
                    </h4>
                      <Accordion type="single" collapsible className="w-full">
                        {contract.functions.map((func, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-sm py-2">
                  <span className="font-mono">{func.name}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {func.type}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-4">
                    {func.description && (
                      <p className="text-sm text-muted-foreground">
                        {func.description}
                      </p>
                    )}
                    {func.inputs.length > 0 && (
                      <div>
                        <p className="text-xs font-medium">Inputs:</p>
                        <ul className="text-xs space-y-1 mt-1">
                          {func.inputs.map((input, idx) => (
                            <li key={idx} className="font-mono">
                              {input.name}:{" "}
                              <span className="text-gray-500">
                                {input.type}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {func.outputs.length > 0 && (
                      <div>
                        <p className="text-xs font-medium">Outputs:</p>
                        <ul className="text-xs space-y-1 mt-1">
                          {func.outputs.map((output, idx) => (
                            <li key={idx} className="font-mono">
                              {output.name ? output.name : `[${idx}]`}:{" "}
                              <span className="text-gray-500">
                                {output.type}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
                      </Accordion>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    target="_blank"
                    to={`/contract-agent/${contract.address}`}
                  >
                    <Button className="w-full">Use Contract</Button>
                  </Link>
                </CardFooter>
              </Card>
            </>
          ))} */}
        </div>
      </main>
    </div>
  );
};

export default OracleList;
