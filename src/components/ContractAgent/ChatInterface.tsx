"use client";

import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
// import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { Alert, AlertDescription } from "components/ui/alert";
import { AlertCircle, Send, Loader2, Loader } from "lucide-react";
import { useEthersSigner } from "utils/useSigner";
import { useAccount } from "wagmi";
import { Button, TextField } from "@mui/material";
// ⚠️ Use caution with hardcoded keys in production!

export function ChatInterface({
  address,
  chain_id,
  functions,
  abis,
}: {
  address: string;
  chain_id: string;
  functions: any;
  abis: any;
}) {
  const { signer } = useEthersSigner();
  const { address: userAddress } = useAccount();

  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem(address);
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            content:
              "Hello! I'm your contract assistant. How can I help you today?",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(
    null
  );
  const [typingMessage, setTypingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (address && signer && tokenContract === null) {
      const contract = new ethers.Contract(address, abis, signer);
      setTokenContract(contract);
    }
  }, [address, signer]);

  useEffect(() => {
    localStorage.setItem(address, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  const typeWriterEffect = async (text: string) => {
    setTypingMessage("");
    for (let i = 0; i <= text.length; i++) {
      setTypingMessage(text.slice(0, i));
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    setTypingMessage(null);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    setError(null);

    try {
      const promptMessages = [
        {
          role: process.env.REACT_APP_PROMPT_ROLE,
          content: `
${process.env.REACT_APP_PROMPT_ONE} ${address} ${process.env.REACT_APP_PROMPT_TWO} ${chain_id}.
${process.env.REACT_APP_PROMPT_THREE}

Available functions:
${JSON.stringify(functions, null, 2)}

Rules:
${process.env.REACT_APP_PROMPT_RULES}

${process.env.REACT_APP_PROMPT_FOUR}:
{
    "functionName": "function_name",
    "args": ["arg1", "arg2"],
    "user_confirmation": true/false,
    "explanation": "Brief explanation of what will happen"
}
${process.env.REACT_APP_PROMPT_SIX}
        `,
        },
        ...messages,
        userMessage,
      ];

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: promptMessages,
            temperature: 0.3,
            max_tokens: 500,
          }),
        }
      );

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = null;
      }

      if (parsed?.functionName && parsed?.args) {
        const result = await executeFunction(parsed.functionName, parsed.args);

        const fullResponse = `✅ ${parsed.explanation}\n\nResult: ${result}`;
        await typeWriterEffect(fullResponse);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: fullResponse,
          },
        ]);
      } else {
        await typeWriterEffect(content);
        setMessages((prev) => [...prev, { role: "assistant", content }]);
      }
    } catch (err) {
      console.error("OpenAI error:", err);
      setError("Failed to process your request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeFunction = async (functionName: string, args: any[]) => {
    if (!tokenContract) throw new Error("Token contract not set");

    try {
      const result = await tokenContract[functionName](...args);

      if (result && typeof result.wait === "function") {
        const receipt = await result.wait();
        return `Transaction successful! Hash: ${receipt.transactionHash}`;
      }

      if (["balanceOf"].includes(functionName)) {
        const decimals = await tokenContract.decimals();
        return ethers.utils.formatUnits(result, decimals);
      }

      return result.toString();
    } catch (err: any) {
      console.error("Smart contract error:", err);
      if (err?.reason) return `Error: ${err.reason}`;
      if (err?.message) return `Error: ${err.message}`;
      return "Error executing function: Unknown issue";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[530px] md:h-[560px] xl:h-[630px] 2xl:h-[87vh]">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!address && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please provide the ERC-20 token contract address to get started.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto  space-y-4 pt-1 rounded-md border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] text-[1rem] ${
                msg.role === "assistant"
                  ? "bg-white/70 text-[#333333] rounded-[20px_20px_20px_0px] px-4 py-3"
                  : "bg-[#7140bf] text-[#ffffff] rounded-[20px_20px_0px_20px] p-[5px_10px_5px_10px]"
              }`}
            >
              <p className="whitespace-pre-wrap overflow-x-auto">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {typingMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-[20px_20px_20px_0px]  bg-white/70 text-[#333333]">
              <p className="whitespace-pre-wrap">
                {typingMessage}
                <span className="animate-pulse">|</span>
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex justify-center sticky bottom-0 pb-6 bg-[#e5e5ff]">
        {/* <div className="bg-white flex "> */}
        <TextField
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about token functions..."
          // className="!placeholder:text-xs md:text-sm"
          sx={{
            borderRadius: "99px 0px 0px 99px",
            width: "60%",
            backgroundColor: "#ffffff",
            "& .MuiOutlinedInput-root": {
              color: "#321b7a",
              "& fieldset": {
                // borderColor: "#e0e0e0",

                border: "none",
              },
              "&:hover fieldset": {
                borderColor: "#7140bf",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#7140bf",
              },
            },
          }}
          maxRows={4}
          disabled={isProcessing}
        />
        <div className="bg-white flex items-center rounded-r-full pr-2">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            // className="self-end"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "99px",
              padding: { xs: "11px 11px", sm: "12px" },
              minWidth: "0px",
              backgroundColor: "#7140bf",
              "&:hover": {
                backgroundColor: "#007bb5",
              },
              "&:disabled": {
                backgroundColor: "#e0cdf8",
              },
            }}
          >
            {isProcessing ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
