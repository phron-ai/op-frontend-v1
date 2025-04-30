import { useState, useRef, useEffect } from 'react';

import './index.scss'

interface RenameModalProps {
    onClose: () => void;
    onRename: (newName: string) => void;
    currentName: string;
}

const RenameModal = ({ onClose, onRename, currentName }: RenameModalProps) => {
    const [newName, setNewName] = useState(currentName);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onRename(newName.trim());
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="rename-modal" ref={modalRef}>
                <div className="rename-modal-header">
                    <h3>Rename Contract</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="rename-modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="contractName">Contract Name</label>
                            <input
                                id="contractName"
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Enter new name"
                                autoFocus
                                className="rename-input"
                            />
                        </div>
                        <div className="button-group">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rename-button"
                                disabled={!newName.trim() || newName.trim() === currentName}
                            >
                                Rename
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RenameModal;