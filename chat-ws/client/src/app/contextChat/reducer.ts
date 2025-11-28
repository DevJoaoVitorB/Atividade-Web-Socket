
import { Action, ChatState } from "./types"

export const reducer = (state: ChatState, action: Action ) : ChatState => {
     switch (action.type) {
        case "SET_USERNAME":
            return {
                ...state, username: action.payload
            }
        case "SET_PASSWORD":
            return {
                ...state, password: action.payload
            }
        case "SET_MESSAGES":
            return {
                ...state, messages: action.payload
            }
        case "ADD_MESSAGE":
            return {
                ...state, messages: [...state.messages, action.payload]
            }
        case "SET_CONNECTION":
            return {
                ...state, connection: action.payload
            }
        default:
            return state;
    }
}