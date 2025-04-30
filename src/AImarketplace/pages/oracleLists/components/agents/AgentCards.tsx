"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  User,
  Calendar,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import networks from "config/chains";
import { Link } from "react-router-dom";

interface NFTCardProps {
  title: string;
  deployedBy: string;
  contract: string;
  agentName?: string;
  agentRole?: string;
  deploymentDate?: string;
  verified?: boolean;
  chainId: number;
  link: string;
}

export default function NFTCard({
  title,
  deployedBy,
  contract,
  agentName = "",
  agentRole = "",
  deploymentDate = "",
  verified = true,
  chainId,
  link,
}: NFTCardProps) {
  const [deployedCopied, setDeployedCopied] = useState(false);
  const [contractCopied, setContractCopied] = useState(false);

  const copyToClipboard = (text: string, type: "deployed" | "contract") => {
    navigator.clipboard.writeText(text);
    if (type === "deployed") {
      setDeployedCopied(true);
      setTimeout(() => setDeployedCopied(false), 2000);
    } else {
      setContractCopied(true);
      setTimeout(() => setContractCopied(false), 2000);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-200 hover:translate-y-[-4px] border border-purple-100 bg-white">
      <CardHeader className="bg-[#43208d] p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {verified && (
            <Badge
              variant="outline"
              className="bg-white/20 text-white border-white/40"
            >
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Deployed by:</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-[#43208d] hover:text-purple-900 hover:bg-purple-50"
                    onClick={() => copyToClipboard(deployedBy, "deployed")}
                  >
                    <span className="font-mono text-xs mr-2">{deployedBy}</span>
                    {deployedCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{deployedCopied ? "Copied!" : "Copy address"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Contract:</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-[#43208d] hover:text-purple-900 hover:bg-purple-50"
                    onClick={() => copyToClipboard(contract, "contract")}
                  >
                    <span className="font-mono text-xs mr-2">{contract}</span>
                    {contractCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  {/* <Link
                    // href={
                    //   networks[chainId].explorer
                    //     ? `${networks[chainId]?.explorer}/address/${address}#code`
                    //     : "/"
                    // }
                    to={`${networks[chainId]?.explorer}/address/${contract}#code`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Link> */}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{contractCopied ? "Copied!" : "Copy address"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between mr-2">
            <div className="text-sm text-gray-500">Chain:</div>
            <div className="flex items-center text-[#43208d] ">
              <img
                src={networks[chainId]?.icon}
                alt="Chain Icon"
                className="h-4 w-4 mr-2"
              />
              <span className=" text-xs mr-2">{networks[chainId]?.name}</span>
              <Link
                to={`${networks[chainId]?.explorer}/address/${link}#code`}
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Agent Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-gray-600">{agentName}</span>
            </div>
            {/* <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-gray-600">{agentRole}</span>
            </div> */}
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-gray-600">{deploymentDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 p-4 border-t border-gray-100">
        <Link className="w-full" target="_blank" to={`/contract-agent/${link}`}>
          {" "}
          <Button className="w-full bg-[#43208d] hover:bg-purple-700 text-white">
            Use Agent
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
