import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import useContract from "smartcontract-builder/hooks/contract";
import { copyToClipboard } from "utils";
import "./index.scss";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { currentContractId, shareContract } = useContract();

  const [shareLink, setShareLink] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShareLink("");
      setIsShared(false);
      setIsPublic(false);
      setIsCopied(false);
    }
  }, [isOpen]);

  const handleShare = async () => {
    try {
      const accessToken = await shareContract(currentContractId, isPublic);
      setShareLink(`${window.location.origin}/share/${accessToken}`);
      setIsShared(true);
    } catch (error) {
      console.error("Failed to share contract:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="share-dialog-title"
      aria-describedby="share-dialog-description"
      className="share-modal-dialog"
    >
      <DialogTitle id="share-dialog-title" className="share-modal-title">
        Share Contract
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="share-dialog-description"
          className="share-modal-description"
        >
          Are you sure you want to share this contract?
        </DialogContentText>
      </DialogContent>

      <DialogActions className="share-modal-actions">
        {isShared ? (
          <>
            <input
              type="text"
              value={shareLink}
              readOnly
              className="share-modal-input"
            />
            <button
              className={`share-button ${isCopied ? "copied" : ""}`}
              onClick={() => copyToClipboard(shareLink, setIsCopied)}
            >
              {isCopied ? "Copied!" : "Copy Link"}
            </button>
          </>
        ) : (
          <>
            <label className="share-modal-checkbox">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                aria-label="Public"
              />
              <span className="checkbox-custom" aria-hidden="true" />
              <span className="checkbox-label">Public</span>
            </label>
            <button className="share-button" onClick={handleShare}>
              Generate Share Link
            </button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default ShareModal;
