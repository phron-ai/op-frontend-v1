import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Switch } from "@mui/material";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight, } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy, CopyCheck } from "lucide-react";

import { NodeJsCode, quickstart_guide, TypeScriptCode } from "api-key/utils";
import { copyToClipboard } from "utils";
import './index.scss';

interface CodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    isUser?: boolean;
}

const CodeModal = (props: CodeModalProps) => {
    const { isOpen, onClose, title, content, isUser } = props;
    const [darkMode, setDarkMode] = useState(false);
    const [isNodeJs, setIsNodeJs] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const code = isNodeJs ? NodeJsCode : TypeScriptCode;

    return (
        <Dialog open={isOpen} onClose={onClose} className="code-modal">
            <DialogContent className="modal-content">
                <DialogTitle className="title" >
                    {
                        !isUser ? <>
                            {`${title} with ${isNodeJs ? 'Node.js' : 'TypeScript'}?`}
                            <Switch className="dark-mode-switch" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        </> : `${title}`
                    }
                </DialogTitle>
                {
                    !isUser ? <>
                        <Button variant="contained" color={isNodeJs ? 'success' : 'info'} size='small' onClick={() => setIsNodeJs(!isNodeJs)}>
                            {isNodeJs ? 'TS' : 'JS'}
                        </Button>
                        {
                            isCopied ? <CopyCheck className="copy-icon" size={18} /> : <Copy size={18} onClick={() => copyToClipboard(code, setIsCopied, "Code copied to clipboard!")} className="copy-icon" />
                        }
                        <div className="code" >
                            <SyntaxHighlighter language="javascript" style={darkMode ? coldarkDark : oneLight}>
                                {code}
                            </SyntaxHighlighter>
                        </div>
                    </> : <h3>{content}</h3>
                }
            </DialogContent>
        </Dialog >
    )
}

export default CodeModal;