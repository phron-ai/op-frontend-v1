import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

import './index.scss';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteModal = ({ isOpen, onClose, onConfirm, item }) => {

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      className="delete-modal-dialog"
    >
      <DialogTitle id="delete-dialog-title" className="delete-modal-title">
        Delete {item}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="delete-dialog-description"
          className="delete-modal-description"
        >
          Are you sure you want to delete this {item}? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions className="delete-modal-actions">
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color="primary"
          variant="contained"
          className="delete-button"
        >
          Delete
        </Button>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          className="cancel-button"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;