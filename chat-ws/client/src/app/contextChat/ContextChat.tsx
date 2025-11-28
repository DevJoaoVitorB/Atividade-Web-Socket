'use client';

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from 'react';
import { reducer } from './reducer';
import { ChatContextType, initialState, Message } from './types';
import { URL } from 'url';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { username } = state;

    // 🔌 Referência para o WebSocket
    const socketRef = useRef<WebSocket | null>(null);

    // 🔄 Timer para reconexão
    const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

    // 🔥 Flag para evitar reconexão automática quando o usuário sai voluntariamente
    const manualDisconnect = useRef(false);

    const setUsername = (username: string) =>
        dispatch({ type: 'SET_USERNAME', payload: username });
    const setPassword = (passowrd: string) =>
        dispatch({ type: 'SET_PASSWORD', payload: passowrd });
    const setMessages = (messages: Message[]) =>
        dispatch({ type: 'SET_MESSAGES', payload: messages });
    const addMessage = (message: Message) =>
        dispatch({ type: 'ADD_MESSAGE', payload: message });
    const setConnection = (status: boolean) =>
        dispatch({ type: 'SET_CONNECTION', payload: status });

    const connect = () => {
        if (!username) return alert('Digite um username!');

        manualDisconnect.current = false;

        // ADICIONAR O IP DA MAQUINA QUE ESTÁ RODANDO O SERVIDOR - ws://192.168.X.X:8000
        socketRef.current = new WebSocket('ws://localhost:8080');

        socketRef.current.onopen = () => {
            alert('🟢 Conectado ao servidor!');
            setConnection(true);

            socketRef.current?.send(
                JSON.stringify({
                    type: 'login',
                    username,
                }),
            );
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('🛰 Mensagem recebida do servidor:', data);

            // Login bem-sucedido - recebe histórico
            if (data.type === 'login_success') {
                setMessages(data.messages);
                alert(`✅ Login realizado como ${username}!`);
            }

            // Login com erro
            if (data.type === 'login_error') {
                alert(`❌ Erro no login: ${data.message}`);
                disconnect();
            }

            // Nova mensagem recebida
            if (data.type === 'new_message') {
                addMessage(data.message);
            }

            // Usuário entrou
            if (data.type === 'user_joined') {
                console.log(`👤 ${data.username} entrou no chat`);
            }

            // Usuário saiu
            if (
                data.type === 'user_left' ||
                data.type === 'user_disconnected'
            ) {
                console.log(`👋 ${data.username} saiu do chat`);
            }
        };

        socketRef.current.onerror = () => {
            if (manualDisconnect.current) return;

            setConnection(false);
            alert('⚠️ Erro na conexão. Tentando reconectar...');

            attemptReconnect();
        };

        socketRef.current.onclose = () => {
            if (manualDisconnect.current) return;

            setConnection(false);
            attemptReconnect();
        };
    };

    const disconnect = () => {
        manualDisconnect.current = true;

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        setConnection(false);

        if (reconnectTimer.current) {
            clearTimeout(reconnectTimer.current);
            reconnectTimer.current = null;
        }
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
    const sendMessage = (message: string) => {
        console.log('SOCKET:', socketRef.current?.readyState);
        if (
            !socketRef.current ||
            socketRef.current.readyState !== WebSocket.OPEN
        ) {
            alert('Sem conexão com o servidor!');
            return;
        }

        const text = message.trim();
        if (!text) return; // impede envio vazio

        socketRef.current.send(
            JSON.stringify({
                type: 'message',
                owner: state.username,
                message: text,
            }),
        );
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
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context)
        throw new Error(
            'usePokedexContext deve ser usado dentro de <PokedexProvider>',
        );
    return context;
};
