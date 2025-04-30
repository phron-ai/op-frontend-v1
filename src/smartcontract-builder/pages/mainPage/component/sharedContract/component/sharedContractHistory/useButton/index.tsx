import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";
import { FilePlus } from "lucide-react";

import useContract from "smartcontract-builder/hooks/contract";
import useAuth from "smartcontract-builder/hooks/auth";

import "./index.scss";

const UseButton = () => {
  const navigate = useNavigate();

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { isAuth, sign } = useAuth();

  const { addSharedContract } = useContract();

  const [signFailed, setSignFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSharedContract = async () => {
    try {
      setSignFailed(false);
      setIsLoading(true);

      if (!isConnected) {
        if (openConnectModal) {
          openConnectModal();
        }
        return;
      }

      if (!isAuth) {
        try {
          await sign();
        } catch (error) {
          console.error("User canceled or sign error:", error);
          setSignFailed(true);
          return;
        }
      }

      await addSharedContract();

      navigate("/agent");
    } catch (error) {
      console.error("handleAddSharedContract error:", error);
      setSignFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (!isConnected) {
      return "Connect Wallet";
    }
    if (!isAuth) {
      return signFailed ? "Sign Failed. Retry?" : "Sign to Continue";
    }
    return "Use";
  };

  return (
    <button
      className="use-button"
      onClick={handleAddSharedContract}
      disabled={isLoading}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    >
      <FilePlus size={20} />
      <span>{isLoading ? "Processing..." : getButtonText()}</span>
    </button>
  );
};

export default UseButton;
