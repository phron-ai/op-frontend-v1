import { Menu, MenuItem, IconButton } from "@mui/material";
import { Edit, Delete, Share } from "@mui/icons-material";
import { MoreVertical, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "components/ui/tooltip";
import useContracts from "smartcontract-builder/hooks/contracts";
import useContract from "smartcontract-builder/hooks/contract";
import { formatText } from "smartcontract-builder/utils";
import phronEyeSrc from "assets/phron-eye.png";
import { Button } from "components/ui/button";
import DeleteModal from "./deleteModal";
import ShareModal from "./shareModal";

function ContractSidebar() {
  const { contracts, contractId, changeContract } = useContracts();
  const { currentContract, renameContract, deleteContract } = useContract();

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMenuClick = (
    index: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    changeContract(index);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteContract = () => {
    setDeleteModalVisible(true);
    handleMenuClose();
  };

  const handleShareContract = () => {
    setIsShareModalVisible(true);
    handleMenuClose();
  };

  const handleRenameContract = () => {
    setEditingIndex(contractId);
    changeContract(contractId);
    setEditingName(currentContract.name);
    handleMenuClose();
    // Focus the input after render
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleRenameSubmit = async (index: number) => {
    if (editingName.trim() && editingName !== currentContract.name) {
      await renameContract(editingName);
    }
    setEditingIndex(null);
  };

  // const sortedContracts = useMemo(() => {
  //   return contracts.sort((a, b) => {
  //     // @ts-ignore
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   });
  // }, [contracts]);

  return (
    <div
      id="agent-sidebar"
      className="p-5 rounded-2xl lg:flex flex-col justify-center"
    >
      <DeleteModal
        item={"Contract"}
        isOpen={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={deleteContract}
      />
      <ShareModal
        isOpen={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
      />
      <div>
        <div className="flex items-center gap-2 mb-4">
          <img
            src={phronEyeSrc}
            alt="phron icon"
            width={14}
            height={14}
            className="object-contain invert"
          />
          <h2 className="text-lg font-semibold">Contracts</h2>
        </div>

        <div className="overflow-auto max-h-[41vh] space-y-3 px-2 scrollbar-hide">
          {contracts.map((contract, index) => (
            <div
              key={index}
              // onClick={() => onChangeContract(contract, index)}
              className={`w-full flex justify-between items-center py-0 px-1 rounded-md transition-colors duration-200 ${
                contractId === index
                  ? "bg-primary text-[#efefff]"
                  : "hover:bg-primary hover:text-[#efefff]"
              }`}
            >
              {editingIndex === index ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  // onBlur={() => handleRenameSubmit(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSubmit(index);
                    } else if (e.key === "Escape") {
                      setEditingIndex(null);
                    }
                  }}
                  className="flex-grow bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  onClick={() => {
                    changeContract(index);
                    setEditingIndex(null);
                  }}
                  onDoubleClick={handleRenameContract}
                  className={`overflow-hidden whitespace-nowrap px-1  text-ellipsis flex-grow cursor-pointer text-sm ${
                    contractId === index ? "font-bold" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatText(contract.name),
                  }}
                />
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconButton
                      onClick={(e) => handleMenuClick(index, e)}
                      aria-label="More options"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <MoreVertical
                        className={`h-4 w-4 ${
                          contractId === index
                            ? "text-[#efefff] hover:text-red-500"
                            : ""
                        } `}
                      />
                    </IconButton>
                  </TooltipTrigger>
                  <TooltipContent>More Options</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#f0f0f0",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  },
                  "& .MuiMenuItem-root": {
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                  },
                }}
              >
                <MenuItem onClick={handleShareContract}>
                  <Share fontSize="small" sx={{ mr: 1 }} />
                  Share
                </MenuItem>
                <MenuItem onClick={handleRenameContract}>
                  <Edit fontSize="small" sx={{ mr: 1 }} />
                  Rename
                </MenuItem>
                <MenuItem onClick={handleDeleteContract}>
                  <Delete fontSize="small" sx={{ mr: 1, color: "#e53e3e" }} />
                  Delete
                </MenuItem>
              </Menu>
            </div>
          ))}
        </div>
        {contracts.length === 0 ? (
          <p className="text-sm mt-3 opacity-70">No Contracts found</p>
        ) : null}
      </div>
      <Button className="mt-4" variant="outline" asChild>
        <Link to="/">
          <Plus className="mr-1 w-4 h-4" />
          Add New Contract
        </Link>
      </Button>
    </div>
  );
}

export default ContractSidebar;
