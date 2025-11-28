
export interface Message {
  owner: string;
  message: string;
}

export interface ChatState {
    username: string;
    password: string;
    messages: Message[];
    connection: boolean;    
}

export type Action =
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_CONNECTION"; payload: boolean }

export interface ChatContextType {
    state: ChatState;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    sendMessage: (message: string) => void;
    setConnection: (status: boolean) => void;
    connect: () => void;
    disconnect: () => void;
}

export const initialState: ChatState = {
    username: "",
    password: "",
    messages: [],
    connection: false 
}