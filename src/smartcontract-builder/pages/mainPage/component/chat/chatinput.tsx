import { useContext, useState } from "react";
import { LoaderPinwheel, Send } from "lucide-react";
import { TextField, Button, Box } from "@mui/material";

import useContracts from "smartcontract-builder/hooks/contracts";
import { ContractContext } from "smartcontract-builder/context";
import useContract from "smartcontract-builder/hooks/contract";

const ChatInput = ({
  isAvailableToShowMessage,
}: {
  isAvailableToShowMessage: boolean;
}) => {
  const { state } = useContext(ContractContext) as ContractContextValue;
  const { currentContract, sendMessage } = useContract() as UseContractReturn;
  const { setIsUserActive } = useContracts();

  const [userInput, setUserInput] = useState("");

  const handleSendMessage = async () => {
    if (state.isLoading) return;
    if (!userInput.trim()) return;
    setUserInput("");
    await sendMessage(currentContract?._id, userInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const changeInput = (value: string) => {
    if (!state.isUserActive) setIsUserActive(true);
    setUserInput(value);
  };

  return (
    <>
      {isAvailableToShowMessage && (
        <Box
          position="fixed"
          bottom="0px"
          height="88px"
          width="100%"
          bgcolor="#e5e5ff"
          // zIndex={30}
        >
          <Box
            component="div"
            sx={{
              position: "fixed",
              bottom: 15,
              left: "60%",
              maxWidth: ["360px", "745px", "100%"],
              transform: "translateX(-60%)",
              width: ["100%", "100%", "calc(70% - 242px)"],
              borderRadius: "99px",
              padding: "0.5rem 1rem",
              backgroundColor: "#ffffff",
              zIndex: 10,
              boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message here..."
                value={userInput}
                onChange={(e) => changeInput(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={4}
                sx={{
                  borderRadius: "20px",
                  "& .MuiOutlinedInput-root": {
                    color: "#321b7a",
                    "& fieldset": {
                      // borderColor: "#e0e0e0",

                      border: "none",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7140bf",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7140bf",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={state.isLoading || userInput.trim() === ""}
                onClick={handleSendMessage}
                // startIcon={
                //   state.isLoading ? (
                //     <LoaderPinwheel className="animate-spin" />
                //   ) : (
                //     <Send />
                //   )
                // }
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "99px",
                  padding: { xs: "9px 11px", sm: "12px" },
                  minWidth: "0px",
                  backgroundColor: "#7140bf",
                  "&:hover": {
                    backgroundColor: "#007bb5",
                  },
                  "&:disabled": {
                    backgroundColor: "#e0cdf8",
                  },
                }}
              >
                {/* Send */}
                {state.isLoading ? (
                  <LoaderPinwheel size={30} className="animate-spin" />
                ) : (
                  <Send size={30} />
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatInput;
