'use client'

import { createContext, ReactNode, useContext, useEffect, useReducer, useRef } from "react";
import { reducer } from "./reducer";
import { ChatContextType, initialState, Message } from "./types";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { username } = state;

    // 🔌 Referência para o WebSocket
    const socketRef = useRef<WebSocket | null>(null);

    // 🔄 Timer para reconexão
    const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

    const setUsername = (username: string) => 
        dispatch({ type: "SET_USERNAME", payload: username });
    const setPassword = (passowrd: string) => 
        dispatch({ type: "SET_PASSWORD", payload: passowrd });
    const setMessages = (messages: Message[]) => 
        dispatch({ type: "SET_MESSAGES", payload: messages });
    const setConnection = (status: boolean) =>
        dispatch({ type: "SET_CONNECTION", payload: status });

    const connect = () => {
        if (!username) return alert("Digite um username!");

        socketRef.current = new WebSocket("ws://localhost:8080");

        socketRef.current.onopen = () => {
            alert("🟢 Conectado ao servidor!");
            setConnection(true);

            // Envia Login
            socketRef.current?.send(JSON.stringify({
                type: "login",
                username,
            }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // Pegar as Mensagens
            if (data.type === "messages") {
                setMessages(data.messages);
            }
        };

        // Erro no Socket
        socketRef.current.onerror = () => {
            alert("⚠️ Erro no WebSocket");
        };

        // Perda de Conexão
        socketRef.current.onclose = () => {
            alert("🔴 Conexão perdida!");

            setConnection(false);

            // Tenta Reconectar
            attemptReconnect();
        };
    };

    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        setConnection(false);
    };

    // Tentativa de Reconexão
    const attemptReconnect = () => {
        if (reconnectTimer.current) return;

        reconnectTimer.current = setTimeout(() => {
            reconnectTimer.current = null;
            connect();
        }, 3000);
    };

    // Enviar Mensagem
    const sendMessage = (text: string) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            alert("Sem conexão com o servidor!");
            return;
        }

        socketRef.current.send(JSON.stringify({
            type: "message",
            owner: state.username,
            message: text,
        }));
    };

    // CleanUp
    useEffect(() => {
        return () => {
            if (socketRef.current) socketRef.current.close();
        };
    }, []);


    return (
        <ChatContext.Provider
            value={{
                state,
                setUsername,
                setPassword,
                setConnection,
                sendMessage,
                connect,
                disconnect,
            }}
        >
            { children }
        </ChatContext.Provider>
    )
} 

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context)
        throw new Error(
            'usePokedexContext deve ser usado dentro de <PokedexProvider>',
        );
    return context;
}