import { KeyRound, MoreVertical, Plus } from "lucide-react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useRef, useState } from "react";
import { useAccount } from "wagmi";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "components/ui/tooltip";
import { formatText } from "smartcontract-builder/utils";
import useOracles from "AImarketplace/hooks/useOracles";
import useOracle from "AImarketplace/hooks/useOracle";
import phronEyeSrc from "assets/phron-eye.png";
import { Button } from "components/ui/button";
import DeleteModal from "./deleteModal";

const ContributeSideBar = () => {
  const { address } = useAccount();
  const navigator = useNavigate();
  const { changeOracleId, oracleId, renameOracle, removeOracle } =
    useOracle() as UseOracleReturn;
  const { userOracles } = useOracles();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<any>(null);

  const handleChangeOracle = (id: string | null) => {
    navigator("/contribute");
    changeOracleId(id);
  };

  const handleMenuClick = (
    id: string | null,
    index: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    handleChangeOracle(id);
    setSelectedIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteOracle = () => {
    setDeleteModalVisible(true);
    handleMenuClose();
  };

  const handleRenameOracle = () => {
    if (selectedIndex !== null) {
      setEditingIndex(selectedIndex);
      setEditingName(userOracles[selectedIndex].name);
      handleMenuClose();
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleRenameSubmit = async (index: number) => {
    if (editingName.trim() && editingName !== userOracles[index].name) {
      await renameOracle(editingName.trim());
    }
    setEditingIndex(null);
  };

  const renderOracleItem = (oracle: Oracle, index: number) => {
    const isEditing = editingIndex === index;
    const isSelected = oracleId === oracle.id;

    return (
      <div
        key={index}
        className={`w-full flex justify-between text-center items-center py-0 px-1 rounded-lg transition-colors duration-200 
                    ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"}`}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={() => handleRenameSubmit(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit(index);
              if (e.key === "Escape") setEditingIndex(null);
            }}
            className="
                            flex-grow bg-transparent
                            border-none focus:outline-none
                            focus:ring-2 focus:ring-blue-500/50
                            rounded px-2 py-1
                            text-sm font-medium
                        "
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            onClick={() => handleChangeOracle(oracle.id)}
            onDoubleClick={() => handleRenameOracle()}
            className={`
                            overflow-hidden whitespace-nowrap text-ellipsis
                            flex-grow cursor-pointer text-sm
                            transition-colors duration-200
                            px-2 py-1
                            ${isSelected ? "font-semibold" : "font-medium"}
                        `}
            dangerouslySetInnerHTML={{ __html: formatText(oracle.name) }}
          />
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                onClick={(e) => handleMenuClick(oracle.id, index, e)}
                aria-label="More options"
                className="
                                    text-muted-foreground
                                    hover:text-destructive hover:bg-destructive/10
                                    transition-colors duration-200
                                    rounded-full
                                    p-1
                                "
              >
                <MoreVertical className="h-4 w-4" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent className="bg-white px-3 py-1.5 text-sm font-medium shadow-lg">
              More Options
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
              padding: "4px",
            },
            "& .MuiMenuItem-root": {
              borderRadius: "8px",
              margin: "2px",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#f8f9fa",
              },
            },
          }}
        >
          <MenuItem onClick={handleRenameOracle}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            <span className="text-sm font-medium">Rename</span>
          </MenuItem>
          <MenuItem onClick={handleDeleteOracle}>
            <Delete fontSize="small" sx={{ mr: 1, color: "#e53e3e" }} />
            <span className="text-sm font-medium">Delete</span>
          </MenuItem>
        </Menu>
      </div>
    );
  };

  return (
    <div
      id="contribute-sidebar"
      className="
            p-5  rounded-2xl
            lg:flex flex-col justify-center
            transition-shadow duration-200
        "
    >
      <div>
        <div
          className="
                    flex items-center gap-3 mb-4
                    px-2 py-1
                "
        >
          <img
            src={phronEyeSrc}
            alt="phron icon"
            width={14}
            height={14}
            className="object-contain invert"
          />
          <h2 className="text-lg font-semibold">Contribute</h2>
        </div>
        <div
          className="
                    overflow-auto max-h-[41vh]
                    space-y-2 scrollbar-hide
                    px-1
                "
        >
          {userOracles.length > 0 ? (
            userOracles.map(renderOracleItem)
          ) : (
            <p className="text-sm mt-3 opacity-70 px-2">No Oracles found</p>
          )}
        </div>
      </div>
      <DeleteModal
        item={"Oracle"}
        isOpen={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={removeOracle}
      />
      <div className="space-y-3 mt-4">
        <Button
          variant="outline"
          onClick={() => handleChangeOracle(null)}
          asChild
          className="w-full transition-all duration-200 hover:shadow-sm"
        >
          <Link
            to="/contribute"
            className="flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Oracle</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="w-full transition-all duration-200 hover:shadow-sm"
        >
          <Link to="/apikey" className="flex items-center justify-center gap-2">
            <KeyRound className="h-4 w-4" />
            <span>Get API key</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ContributeSideBar;
