import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from "@mui/material/transitions";
import React, { useState, useRef, useEffect } from "react";

import useContract from "smartcontract-builder/hooks/contract";
import { copyToClipboard } from "utils";
import './index.scss'

const ShareModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { currentContractId, shareContract } = useContract();
    const [shareLink, setShareLink] = useState("");
    const [isShared, setIsShared] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const sharedModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sharedModalRef.current && !sharedModalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        setShareLink("");
        setIsShared(false);
        setIsPublic(false);
        document.addEventListener('mousedown', handleClickOutside);
        setIsShared(false);
        // return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        console.log("isShared: ", isShared)
    }, [isShared])

    const handleShare = async () => {
        const accessToken = await shareContract(currentContractId, isPublic);
        setShareLink(window.location.origin + "/share/" + accessToken);
        setIsShared(true);
    }

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
                <DialogContentText id="share-dialog-description" className="share-modal-description">
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
                            className={`share-button ${isCopied ? 'copied' : ''}`}
                            onClick={() => copyToClipboard(shareLink, setIsCopied)}
                        >
                            {isCopied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </>
                ) : (
                    <>
                        <label className="share-modal-checkbox">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                aria-label={'Public'}
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
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default ShareModal