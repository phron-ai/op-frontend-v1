"use client";
//@ts-nocheck
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useAuth from "smartcontract-builder/hooks/auth";
import { useEthersSigner } from "utils/useSigner";
import { Button } from "../../../components/ui/button";
import "./index.scss";
import { TextEffect } from "../../../components/ui/text-effect";
import { Modal } from "./Modal";
import useContract from "../../../smartcontract-builder/hooks/contract";
import { Textarea } from "../../../components/ui/textarea";
import { ContractContext } from "../../../smartcontract-builder/context";
import LoadingButton from "../buttons";
const Signature = () => {
  const navigate = useNavigate();
  const { isAuth, sign } = useAuth();
  const { signer } = useEthersSigner();
  const [idea, setIdea] = useState("");
  const { createContract } = useContract();
  const { state } = useContext(ContractContext) as ContractContextValue;
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  // useEffect(() => {
  //   if (!isAuth) return;
  //   navigate("/");
  // }, [isAuth]);

  const signAndMove = async () => {
    await sign();
    setShowAuthModal(false);
    navigate("/");
  };
  const createIdea = async () => {
    if (!idea.trim()) return;

    // if (!address) {
    //   alert("You must connect!");
    //   return;
    // }

    // let _idea = "";

    //     if (requirements) {
    //       _idea =
    //         idea +
    //         `\n
    // Scope:
    // ${Object.entries(chatMode)
    //   .map(([key, value]) => `- ${camelToNormal(key)}: ${value}`)
    //   .join("\n")}
    // `;
    //     }
    const result = await createContract(idea, state.chatMode);
    if (!result) return;
    setLoading(false);
    navigate(`/agent`);
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line from being added
      console.log("Enter key pressed");
      setLoading(true);
      createIdea();
    }
  };
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);
  const colors = [
    "placeholder:text-blue-300/80",
    "placeholder:text-purple-300/80",
    "placeholder:text-[#b43d5e]/80",
    "placeholder:text-gray-400/80",
    "placeholder:text-[#43208d]/80",
  ];
  const placeholders = [
    "Launch Your Smart Contract in Minutes.",
    "Generate NFT Collections Instantly.",
    "Tokenize Anything. Launch Everywhere.",
    "Audit Your Contracts-Fast, Transparent, Reliable.",
    "Let AI Agents Manage & Optimize Your Smart Contracts 24/7.",
  ];
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    const currentPlaceholder = placeholders[currentPlaceholderIndex];

    if (isDeleting) {
      if (placeholderText.length === 0) {
        setIsDeleting(false);
        setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setTypingSpeed(100);
        return;
      }

      typingTimer.current = setTimeout(() => {
        setPlaceholderText(
          currentPlaceholder.substring(0, placeholderText.length - 1)
        );
      }, 50);
    } else {
      if (placeholderText === currentPlaceholder) {
        typingTimer.current = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return;
      }

      typingTimer.current = setTimeout(() => {
        setPlaceholderText(
          currentPlaceholder.substring(0, placeholderText.length + 1)
        );
      }, typingSpeed);

      setTypingSpeed(50);
    }
  }, [placeholderText, currentPlaceholderIndex, isDeleting, placeholders]);
  const handleTextareaClick = () => {
    if (!isAuth) {
      setShowAuthModal(true);
    }
  };
  return (
    <div>
      <video autoPlay loop muted className="hero" playsInline>
        <source src="/holographic.mp4" type="video/mp4" />
      </video>
      <div className="dashboard-container">
        <div className="mb-4">
          {/* <img src="/images/notification-icon.png" alt="" /> */}
        </div>
        <h1 className="text-4xl mt-5 text-black font-bold">
          <TextEffect
            per="char"
            delay={0.5}
            variants={{
              container: {
                hidden: {
                  opacity: 0,
                },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  rotateX: 90,
                  y: 10,
                },
                visible: {
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  transition: {
                    duration: 0.2,
                  },
                },
              },
            }}
          >
            From concept to AI reality in moments.
          </TextEffect>
        </h1>
        <p className="mb-4 text-4xl flex flex-col md:flex-row">
          <span className="text-primary font-black">
            <TextEffect
              per="char"
              delay={1.9}
              variants={{
                container: {
                  hidden: {
                    opacity: 0,
                  },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    rotateX: 90,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    rotateX: 0,
                    y: 0,
                    transition: {
                      duration: 0.2,
                    },
                  },
                },
              }}
            >
              OpenPhron&nbsp;
            </TextEffect>
          </span>
          <TextEffect
            per="char"
            delay={3.9}
            variants={{
              container: {
                hidden: {
                  opacity: 0,
                },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  rotateX: 90,
                  y: 10,
                },
                visible: {
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  transition: {
                    duration: 0.2,
                  },
                },
              },
            }}
          >
            is your AI powerhouse.
          </TextEffect>
        </p>
        <>
          <div className="w-full max-w-[700px] mx-auto p-4">
            <div className="rounded-xl bg-white sm:rounded-[20px] w-full shadow-lg p-3">
              <div>
                <Textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={placeholderText}
                  className={`placeholder:text-black/50  placeholder:text-md  rounded-xl bg-[#E5E5FF]/50 p-3 border-0 focus:ring-0 focus:outline-none min-h-[100px] w-full resize-none`}

                  onKeyDown={handleKeyDown}
                  onClick={handleTextareaClick}
                />
              </div>
              <p className="text-sm text-center text-black/60 p-3">
                Don't rely entirely on OpenPhron; double-check important facts.
              </p>
            </div>
          </div>
          <div className="h-5 w-5">
            {loading && <LoadingButton></LoadingButton>}
          </div>
        </>
      </div>
      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <div className="p-6 text-center">
          {!isAuth && signer ? (
            <h2 className="text-2xl font-bold mb-4">Sign Your Wallet</h2>
          ) : (
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          )}
          {!isAuth && signer ? (
            <p className="mb-6 text-gray-600">
              Please sign your wallet to continue creating smart contracts
              with&nbsp;
              <span className="text-primary font-black">OpenPhron</span>
            </p>
          ) : (
            <p className="mb-6 text-gray-600">
              Please connect your wallet to continue creating smart contracts
              with&nbsp;
              <span className="text-primary font-black">OpenPhron</span>
            </p>
          )}
          {/* <ConnectWalletButton onConnect={handleConnect} /> */}
          <div className="flex justify-center items-center">
            {!isAuth && signer ? (
              <>
                <Button
                  size="lg"
                  className="py-2 px-4 rounded-lg  font-semibold"
                  onClick={signAndMove}
                >
                  Sign Message
                </Button>
              </>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Signature;
