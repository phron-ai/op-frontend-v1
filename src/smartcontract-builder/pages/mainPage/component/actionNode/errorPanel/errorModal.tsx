import React from "react";
import { XCircle } from "lucide-react";
import { Dialog, DialogContent } from "@mui/material";
import { ErrorOutline, CheckCircleOutline, Code } from "@mui/icons-material";
import AnsiErrorDisplay from "./ansiErrorDisplay";
import "./errorModal.scss";

interface ErrorModalProps {
  errors: {
    form: "compile" | "test";
    message: string;
  };
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handleModify: any;
  isModifyLoading: boolean;
}

const ErrorModal = (props: ErrorModalProps) => {
  const {
    errors,
    isModalOpen,
    setIsModalOpen,
    handleModify,
    isLoading,
    isModifyLoading,
  } = props;

  const isCompileError = errors?.form === "compile";
  const modalTitle = isCompileError ? "Compilation Results" : "Test Results";

  return (
    <Dialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className={`error-modal ${
        isCompileError ? "compile-modal" : "test-modal"
      }`}
      aria-labelledby="modal-results-title"
      keepMounted={false}
      disablePortal={false}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={false}
      tabIndex={-1}
    >
      <DialogContent className="error-content" tabIndex={-1}>
        {isLoading ? (
          <ModalLoading
            isCompileError={isCompileError}
            isModifyLoading={isModifyLoading}
          />
        ) : (
          <>
            <div
              className={`modal-header ${
                isCompileError ? "compile-header" : "test-header"
              }`}
            >
              <div className="header-content">
                {errors?.form === "compile" ? (
                  <Code
                    className="status-icon error"
                    aria-label="Compilation Error"
                  />
                ) : errors?.message?.includes("FAIL") ? (
                  <ErrorOutline
                    className="status-icon error"
                    aria-label="Test Failed"
                  />
                ) : (
                  <CheckCircleOutline
                    className="status-icon success"
                    aria-label="Test Passed"
                  />
                )}
                <h2 id="modal-results-title" tabIndex={0}>
                  {modalTitle}
                </h2>
              </div>
              <button
                className="close-icon-button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                <XCircle className="close-icon" size={24} />
              </button>
            </div>
            <AnsiErrorDisplay
              errors={errors}
              className={isCompileError ? "compile-content" : "test-content"}
              handleModify={handleModify}
              isLoading={isLoading}
              isModifyLoading={isModifyLoading}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ModalLoading = ({
  isCompileError,
  isModifyLoading,
}: {
  isCompileError: boolean;
  isModifyLoading: boolean;
}) => {
  const loadingText = isModifyLoading
    ? "Modifying"
    : isCompileError
    ? "Compiling"
    : "Running Tests";
  const loadingMessage = isModifyLoading
    ? "Please wait while we modify your contract..."
    : isCompileError
    ? "Please wait while we compile your contract..."
    : "Please wait while we verify your contract...";

  return (
    <div
      className="loading-container overflow-x-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="loading-text">{loadingText}</div>
      <div className="loading-progress">
        <div className="loading-bar" />
      </div>
      <div className="loading-message">{loadingMessage}</div>
    </div>
  );
};

export default ErrorModal;
