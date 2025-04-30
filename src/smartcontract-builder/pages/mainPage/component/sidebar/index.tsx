import { useContext, useState } from "react";
import { Trash2, Plus, MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "components/ui/sheet";
import useContracts from "smartcontract-builder/hooks/contracts";
import useContract from "smartcontract-builder/hooks/contract";
import { formatText } from "smartcontract-builder/utils";
import { ScrollArea } from "components/ui/scroll-area";
import phronEyeSrc from "assets/phron-eye.png";
import { Button } from "components/ui/button";
import { Logo } from "components/ui/logo";
import { ContractContext } from "smartcontract-builder/context";

const SideBar = () => {
  const { contractId, contracts, changeContract } = useContracts();
  const { state, update } = useContext(ContractContext) as ContractContextValue;
  const { deleteContract } = useContract();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <div
          id="agent-sidebar"
          className="hidden h-[500px] p-5 bg-white rounded-2xl lg:flex flex-col justify-center w-[250px]"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={phronEyeSrc}
                alt="phron icon"
                width={14}
                height={14}
                className="object-contain invert"
              />
              <h2 className="text-lg font-semibold">Contracts</h2>
            </div>

            <div className="space-y-3 scrollbar-hide">
              {contracts.map((contract, index) => (
                <div key={index}>
                  {/* <Button
                    variant={contractId === index ? "default" : "outline"}
                    onClick={() => changeContract(index)}
                    className="w-full justify-between"
                  >
                    {contract.name}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-6 w-2 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContract(index);
                            }}
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Contract</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Button> */}
                  <Button
                    variant={contractId === index ? "default" : "outline"}
                    onClick={() => changeContract(index)}
                    className="w-full justify-between"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formatText(contract.name),
                      }}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            role="button"
                            tabIndex={0}
                            className="h-6 w-2 text-muted-foreground hover:text-destructive flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContract(contract._id);
                            }}
                            aria-label="Delete Contract"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Delete Contract</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Button>
                </div>
              ))}
            </div>

            {contracts.length === 0 ? (
              <p className="text-sm mt-3 opacity-70">No Contracts found</p>
            ) : null}
          </div>
          <Button className="mt-auto" variant="outline" asChild>
            <Link to="/">
              <Plus className="mr-1 w-4 h-4" />
              Add New Contract
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(true);
                }}
                className="inline-block z-10 absolute left-0 top-o lg:hidden rounded-full"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] border-black "
            >
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <p>Your Contracts</p>
                <div>
                  <ScrollArea className="h-full overflow-auto">
                    <div className="scrollbar-hide h-[calc(100vh-232px)]">
                      {contracts.map((contract, index) => (
                        <div key={index}>
                          {/* <Button
                            variant={
                              contractId === index ? "default" : "outline"
                            }
                            onClick={() => changeContract(index)}
                            className="w-full justify-between"
                          >
                            {contract.name}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteContract(index);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Contract</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Button> */}
                          <Button
                            variant={
                              contractId === index ? "default" : "outline"
                            }
                            onClick={() => changeContract(index)}
                            className="w-full justify-between"
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: formatText(contract.name),
                              }}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Delete Contract"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive flex items-center justify-center"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteContract(contract._id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>Delete Contract</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  <Link to="/" className="flex gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Contract</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default SideBar;
