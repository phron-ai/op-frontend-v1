//@ts-nocheck
import React, { useState, useEffect, useMemo } from "react";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatText, parseMessage } from "smartcontract-builder/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import useContracts from "smartcontract-builder/hooks/contracts";

interface TypewriterEffectProps {
  text: string;
  speed?: number;
  setIsTyping?: (isTyping: boolean) => void;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 50,
  setIsTyping,
}) => {
  const { setIsLoading } = useContracts();
  const [displayedText, setDisplayedText] = useState<string>("");
  const words = text.split(" ");
  const parsedText = parseMessage(text);

  const isOnlyCode = useMemo(() => {
    if (parsedText.length === 1 && parsedText[0].type === "code") {
      return true;
    }
    if (
      parsedText.length === 2 &&
      parsedText[0].type === "code" &&
      parsedText[1].content === "\n"
    ) {
      return true;
    }
    return false;
  }, [parsedText]);

  useEffect(() => {
    let currentIndex = 0;
    let chunkSize = 10;
    let nextIndex = Math.min(
      Math.floor(Math.random() * chunkSize) + 1,
      words.length - currentIndex
    );
    const intervalId = setInterval(() => {
      if (currentIndex < words.length - 1) {
        setDisplayedText(words.slice(0, currentIndex).join(" "));
        currentIndex += nextIndex;
      } else {
        if (setIsTyping) {
          setIsTyping(false);
          setIsLoading(false);
        }
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [speed]); // Removed unnecessary dependency 'text'

  return (
    <>
      {isOnlyCode ? (
        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
          {displayedText}
        </SyntaxHighlighter>
      ) : (
        <div
          className="typewriter-text"
          dangerouslySetInnerHTML={{ __html: formatText(displayedText) }}
        />
      )}
    </>
  );
};
