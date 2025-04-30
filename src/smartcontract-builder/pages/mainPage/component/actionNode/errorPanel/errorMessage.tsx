import {
  AlertTriangle,
  CheckCircle,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

import { cleanErrorMessage } from "smartcontract-builder/utils/deploy";
import LoadingButton from "smartcontract-builder/components/buttons";
import AnsiToHtml from "ansi-to-html";
import "./errorMessage.scss";

interface ErrorMessageProps {
  errors: {
    form: "compile" | "test";
    message: string;
  };
  handleModify: any;
  setIsModalOpen: any;
  isLoading: boolean;
}

const ErrorMessage = (props: ErrorMessageProps) => {
  const { errors, handleModify, setIsModalOpen, isLoading } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const isCompileError = errors?.form === "compile";
  const hasError = isCompileError
    ? errors.message
    : errors?.message?.includes("FAIL");
  const ansiToHtml = new AnsiToHtml();

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`error-message ${hasError ? "error" : "success"}`}>
      <div className="message-content">
        <div className="status-icon">
          {isCompileError ? (
            <Code className={hasError ? "error" : "success"} />
          ) : hasError ? (
            <AlertTriangle className="error" />
          ) : (
            <CheckCircle className="success" />
          )}
        </div>
        <div className="message-text">
          <h4>
            {isCompileError ? "Compilation" : "Test"}{" "}
            {hasError ? "Failed" : "Passed"}
          </h4>
          <div
            className="details-toggle"
            onClick={toggleDetails}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && toggleDetails()}
          >
            <p>
              {hasError
                ? "Click to see details"
                : "All checks passed successfully"}
            </p>
            {hasError && (
              <span className="toggle-icon">
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </span>
            )}
          </div>
          {isExpanded && (
            <div
              onClick={() => setIsModalOpen(true)}
              className="error-details"
              dangerouslySetInnerHTML={{
                __html: ansiToHtml.toHtml(cleanErrorMessage(errors) || ""),
              }}
            />
          )}
        </div>
      </div>
      {hasError && (
        <LoadingButton
          onClick={handleModify}
          disabled={isLoading}
          className="modify"
        >
          Let AI improve it for you 🤖
        </LoadingButton>
      )}
    </div>
  );
};

export default ErrorMessage;
