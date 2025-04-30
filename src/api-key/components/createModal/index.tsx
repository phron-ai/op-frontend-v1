import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from "@mui/material/transitions";
import { Copy, CopyCheck, KeyRound } from 'lucide-react'
import React, { use, useEffect, useState } from 'react';

import useAuth from 'smartcontract-builder/hooks/auth';
import { useApiKey } from 'api-key/hooks';
import { copyToClipboard } from 'utils';
import './index.scss';

interface ApiCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  createdApiKey: string;
  setCreatedApiKey: (apiKey: string) => void;
}

const ApiCreationModal = (props: ApiCreationModalProps) => {
  const { isOpen, onClose, createdApiKey, setCreatedApiKey } = props;

  const { isAuth, sign } = useAuth();
  const { createAPIkey } = useApiKey();

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [apiName, setApiName] = useState('');

  useEffect(() => {
    if (isOpen) return;
    setApiName('');
    setCreatedApiKey('');
    setIsCopied(false);
  }, [onClose]);

  const handleCreateAPIkey = async () => {
    if (createdApiKey) {
      copyToClipboard(createdApiKey, setIsCopied, "API key copied to clipboard");
      return;
    }
    if (apiName.length === 0) return;
    const data = await createAPIkey(apiName);
    if (!data) return;
    setCreatedApiKey(data.apiKey);
  }

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="use-dialog-title"
      aria-describedby="use-dialog-description"
      className="use-modal-dialog"
    >
      <DialogTitle id="use-dialog-title" className="use-modal-title">
        {!createdApiKey ? "Create API key" : "Created API key"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="use-dialog-description" className="use-modal-description">
          <label htmlFor="">{!createdApiKey ? "API Name:" : ""}</label>
          <input
            className='api-name-input'
            type="text"
            value={!createdApiKey ? apiName : createdApiKey}
            onChange={(e) => setApiName(e.target.value)}
            placeholder='Enter API name'
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions className="use-modal-actions">
        <button onClick={onClose} className='cancel-btn'>
          Cancel
        </button>
        {
          isAuth ? <button onClick={handleCreateAPIkey}
            className={apiName ? 'api-create-btn' : (!createdApiKey ? 'none' : 'api-create-btn')}
          >
            {!createdApiKey ? <KeyRound size={18} className='mr-1' /> : (isCopied ? <CopyCheck size={18} className='mr-1' /> : <Copy size={18} className='mr-1' />)}
            {!createdApiKey ? "Create API key" : (isCopied ? "Copied" : "Copy")}
          </button>
            : <button className='api-create-btn' onClick={sign}>Please Sign to use</button>
        }
      </DialogActions>
    </Dialog >
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default ApiCreationModal;