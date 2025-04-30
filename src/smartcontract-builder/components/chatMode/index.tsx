import { useContext } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { ContractContext } from "smartcontract-builder/context";
import { Label } from "components/ui/label";

const ChatMode = () => {
    const { state, update } = useContext(ContractContext) as ContractContextValue;

    return (
        <div className="w-full max-w-[180px]">
            <Label className="font-bold hidden xl:block">
                Select Chat Mode
            </Label>
            <Select
                value={state.chatMode}
                onValueChange={(v) => {
                    update({ chatMode: v, isUserSelectedChatMode: true });
                }}
            >
                <SelectTrigger className="mt-1 bg-white rounded-xl">
                    <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2">Basic</SelectItem>
                    <SelectItem value="3">Advance</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default ChatMode;