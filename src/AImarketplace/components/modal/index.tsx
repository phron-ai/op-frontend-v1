import { Dialog } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';

import { DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';
import './index.scss';

const Modal = ({ isOpen, onClose, title, children }) => {
    const [modalstyle, setModalStyle] = useState(true);

    useEffect(() => {
        if (!title) return;
        title === "Subscribe this Oracle" ? setModalStyle(true) : setModalStyle(false);
    }, [title])

    if (!isOpen) return null;
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;