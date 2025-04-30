// Define the shape of your state
interface ContractState {
  address: string;
  stepId: number;
  isFinalStep: boolean;
  contractId: number;
  contracts: Contract[]; // Replace with a more specific type if available
  workflows: Workflow[]; // Replace with a more specific type if available
  workflowId: number;
  sharedContract: any;
  isLoading: boolean;
  isUserActive: boolean;
  isApprove: boolean;
  isUpgradeModalVisible: boolean;
  someOracles: Oracle[];
  total_token: number;
  isAuth: boolean;
  newTypingMessage?: {
    contractId: string;
    stepId: number;
    index: number;
  };
  chatMode: string;
  // isVerified: boolean;
  isUserSelectedChatMode?: boolean;
  currentContractAddress: string;
  currentContractChainId: string;
  currentContractAbis: any;
  aiAgentCode: any;
  agentId: string;
}

interface DeployedContract {
  userAddress: string;
  address: string;
  chainId: number;
  abi: any;
  timestamp: string;
  auditReportStatus: string;
  isAudit: string;
}

// Define the shape of the context value
interface ContractContextValue {
  state: ContractState;
  update: (newState: Partial<ContractState>) => void;
}

interface Workflow {
  id: string;
  name: string;
  disableMessage: boolean;
  assistors: Assistor[];
  parameters: any;
}

interface Assistor {
  name: string;
  instruction: string;
  result_instruction: string;
  minChatCount: number;
  isAuto: boolean;
  action: boolean;
}

interface Contract {
  _id: string;
  workflowId: number;
  name: string;
  steps: Step[];
}

interface Step {
  history: Message[];
  result: Result;
}

interface Result {
  name: string;
  content: string;
}

interface Message {
  role: string;
  content: string;
}

interface UseContractReturn {
  currentContract: Contract;
  currentMessages: Step;
  stepId: number;
  isFinalStep: boolean;
  createContract: (idea: string, chatMode: string) => Promise<Contract>;
  sendMessage: (_id: string, message: string, stepId?: number) => Promise<any>;
  approve: () => Promise<void>;
  changeStepId: (id: number) => void;
  changeToFinalStep: () => void;
}

interface UseContractsReturn {
  contractId: number;
  contracts: Contract[];
  updateContracts: (address: string) => Promise<void>;
  schangeContractendMessage: (_id: number) => Promise<void>;
}

interface UseWorkflowReturn {
  workflow: Workflow;
  updateWorkflow: () => void;
}
