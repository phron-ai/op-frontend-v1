import { Copy, Loader, StopCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Done } from "@mui/icons-material";
import { Button } from "@mui/material";

import { cleanErrorMessage } from "smartcontract-builder/utils/deploy";
import { copyToClipboard } from "utils";
import AnsiToHtml from "ansi-to-html";
import "./ansiErrorDisplay.scss";

interface AnsiErrorDisplayProps {
  errors: any;
  className?: string;
  handleModify?: any;
  isLoading?: boolean;
  isModifyLoading: boolean;
}

const AnsiErrorDisplay = (props: AnsiErrorDisplayProps) => {
  const { errors, className, handleModify, isLoading, isModifyLoading } = props;
  const outputRef = useRef<HTMLDivElement>(null);
  const ansiToHtml = new AnsiToHtml();

  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [savedCurrentIndex, setSavedCurrentIndex] = useState(0);

  const copyErrorToClipboard = (): void => {
    try {
      const cleanedError = cleanErrorMessage(errors);
      navigator.clipboard.writeText(cleanedError);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  useEffect(() => {
    if (!errors?.message) return;
    const cleanedError = cleanErrorMessage(errors);
    let currentIndex = savedCurrentIndex;

    const typeWriter = () => {
      if (currentIndex < cleanedError.length && isTyping) {
        const chunkSize = 50;
        const nextIndex = Math.min(
          currentIndex + chunkSize,
          cleanedError.length
        );
        setDisplayText(cleanedError.slice(0, nextIndex));
        currentIndex = nextIndex;
        setSavedCurrentIndex(currentIndex);
        typingTimeoutRef.current = setTimeout(typeWriter, 50);
      } else {
        setIsComplete(true);
      }
    };

    if (isTyping) {
      typeWriter();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [errors, isTyping]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayText]);

  const htmlContent = ansiToHtml.toHtml(displayText);

  return (
    <div className={`ansi-error-display ${className || ""}`}>
      <div className="output-header">
        <div className="status-badges">
          {isComplete && errors.form === "test" ? (
            <>
              <span
                className={`badge ${
                  errors?.message?.includes("FAIL") ? "error" : "success"
                }`}
              >
                {errors?.message?.includes("FAIL") ? "Failed" : "Passed"}
              </span>
              <span className="badge time">
                {errors?.message?.match(/Time:\s*([\d.]+)\s*s/)?.[1] || "0.00"}s
              </span>
              <span className="badge time modify" onClick={handleModify}>
                {isModifyLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Fix with AI"
                )}
              </span>
            </>
          ) : (
            <span className="badge time modify" onClick={handleModify}>
              {isModifyLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Fix with AI"
              )}
            </span>
          )}
        </div>
        <div className="actions">
          {!isComplete ? (
            isTyping ? (
              <Button
                onClick={() => setIsTyping(false)}
                className="stop typing-button"
                size="small"
                variant="contained"
                color="secondary"
              >
                <StopCircle size={14} />
                Stop
              </Button>
            ) : (
              <Button
                onClick={() => setIsTyping(true)}
                className="continue typing-button"
                size="small"
                variant="contained"
                color="primary"
              >
                Continue
              </Button>
            )
          ) : (
            ""
          )}
          {copied ? (
            <Done className="copy-icon success" />
          ) : (
            <Copy className="copy-icon" onClick={copyErrorToClipboard} />
          )}
        </div>
      </div>
      <div
        ref={outputRef}
        className="output-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default AnsiErrorDisplay;
