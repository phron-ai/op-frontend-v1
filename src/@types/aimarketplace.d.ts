// Define the shape of your state
interface OracleState {
  oracles: Oracle[];
  questions: Question[];
  isLoadingOracle: boolean;
  someOracles: Oracle[];
  oracleId: string | null;
}

interface OracleContextValue {
  state: OracleState;
  update: (newState: Partial<OracleState>) => void;
}

interface Oracle {
  id: string;
  name: string;
  description: string;
  subscriptionPrice: number;
  owner: string
}

interface Question {
  id: string;
  oracleId: string;
  question: string;
  answer: string;
}

interface SubScription {
  user: string;
  oracleId: string;
  userContract: string;
  expire: number;
}

interface UseOracleReturn {
  oracleId: string | null;
  oracle: Oracle | undefined;
  renameOracle: (name: string) => Promise<void>;
  subscribe: (userContract: string) => Promise<void>;
  updateQuestion: (data: any) => Promise<void>;
  changeOracleId: (id: string | null) => void;
  removeOracle: (oracleId: string) => Promise<void>;
}

interface UseOraclesReturn {
  oracles: Oracle[] | undefined;
  updateOracles: () => Promise<any>;
  createOracle: () => (name: string, description: string, price: number) => Promise<void>
}

interface UseQuestionsReturn {
  questions: Question[] | undefined;
  addQuestion: (question: string, answer: string) => Promise<void>;
  updateQuestions: () => Promise<void>;
  questionForOracle: (oracle_id: string) => Question[];
}

interface UseSubScriptionReturn {
  subscribeForSign: (contractAddress: string) => Promise<any>;
  getSubscriptionForOracle: (oracle_id: string) => Promise<SubScription[]>;
  getSubscriptionForUser: () => Promise<SubScription[]>;
}