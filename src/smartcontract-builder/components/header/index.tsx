import { useLocation, useNavigate, Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { useAccount } from "wagmi";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "components/ui/sheet";
import useContracts from "smartcontract-builder/hooks/contracts";
import useWorkflow from "smartcontract-builder/hooks/workflow";
import useQuestions from "AImarketplace/hooks/useQuestions";
import useOracles from "AImarketplace/hooks/useOracles";
import useAuth from "smartcontract-builder/hooks/auth";
import useCost from "smartcontract-builder/hooks/cost";
import { Button } from "components/ui/button";
import { saveAddress } from "utils/useSigner";
import { Logo } from "components/ui/logo";
import useTimer from "utils/useTimer";
import "./index.scss";

const Header: React.FC = () => {
  const { address } = useAccount();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const { updateContracts } = useContracts();
  const { updateOracles, updateSomeOracle } = useOracles();
  const { updateQuestions } = useQuestions();
  const { updateWorkflow } = useWorkflow();
  const { getToken } = useCost();
  const { getSignature } = useAuth()
  const { timer } = useTimer(10);
  const { pathname } = useLocation();

  useEffect(() => {
    getSignature();

    if (address) {
      saveAddress(address);
      getToken();
    } else {
      navigate('/');
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      updateOracles();
      updateSomeOracle();
      updateQuestions();
      updateContracts();
      updateWorkflow();
      console.log("All data updated!");
    }
  }, [timer, address]);

  return (
    <div className="max-w-[1390px] mx-auto xl:sticky top-2 z-10">
      <header className={`pt-1 pb-2 rounded-full px-4 xl:px-0`}>
        <div className="bg-white shadow-md rounded-full py-2 px-6 flex justify-between items-center">
          <Logo />

          <nav className="hidden xl:flex gap-6">
            {address ? (
              <>
                <Link
                  to="/oracle"
                  className={pathname === "/" ? "font-semibold" : ""}
                >
                  AI Library
                </Link>
                <Link
                  to="/contribute"
                  className={
                    pathname === "/contribute" ? "font-semibold" : ""
                  }
                >
                  Contribute
                </Link>
                <Link
                  to="/agent"
                  className={pathname === "/agent" ? "font-semibold" : ""}
                >
                  My Contracts
                </Link>
                <Link
                  to="/subscriptions"
                  className={
                    pathname === "/subscriptions" ? "font-semibold" : ""
                  }
                >
                  My Subscriptions
                </Link>
              </>
            ) : (
              <>
                <Link to="">AI Library</Link>
                <Link to="">My Contract</Link>
              </>
            )}
          </nav>

          <div className="flex items-center justify-end space-x-2">
            <div className="connect-button sm:block hidden">
              <ConnectButton />
            </div>
            {/* Mobile Navigation */}
            <div className="xl:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    className="inline-block rounded-full"
                  >
                    <MenuIcon />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[400px] border-black "
                >
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                  <div className="flex flex-col gap-4 mt-8">
                    {address ? (
                      <>
                        <Link to="/oracle">AI Library</Link>
                        <Link to="/contribute">Contribute</Link>
                        <Link to="/agent">My Contracts</Link>
                        <Link to="/subscriptions">My Subscriptions</Link>
                      </>
                    ) : (
                      <>
                        <Link to="">AI Library</Link>
                        <Link to="">My Contract</Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="connect-button max-w-[1390px] mx-auto px-4 pt-2 flex justify-end sm:hidden">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;