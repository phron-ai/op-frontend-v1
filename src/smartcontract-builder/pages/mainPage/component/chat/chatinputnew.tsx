import { useContext, useState } from "react";
import { LoaderPinwheel, Send } from "lucide-react";
import { TextField, Button, Box } from "@mui/material";

import useContracts from "smartcontract-builder/hooks/contracts";
import { ContractContext } from "smartcontract-builder/context";
import useContract from "smartcontract-builder/hooks/contract";

const ChatInputNew = ({
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
          flex="center"
          component="div"
          className="sticky bottom-0 w-full  h-[80px] md:h-[100px] bg-[#e5e5ff] flex  xl:max-w-[868px]"
        >
          <Box component="div" className="w-full">
            <Box
              component="div"
              className="  flex justify-center w-full px-4"
              alignItems="center"
            >
              <Box
                component="div"
                className="flex justify-center w-full max-w-[670px] bg-white rounded-full py-2 px-2 md:py-2 md:px-2 "
              >
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
                    padding: { xs: "6px 15px", sm: "13px 14px" },
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
        </Box>
      )}
    </>
  );
};

export default ChatInputNew;
