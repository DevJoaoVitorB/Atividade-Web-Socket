import { WebSocketServer, WebSocket } from "ws";

// --------------------------
// TIPOS
// --------------------------
interface ClientInfo {
    socket: WebSocket;
    username: string;
}

interface Message {
    owner: string;
    message: string;
}

// --------------------------
// VARIÁVEIS DO SERVIDOR
// --------------------------
const PORT = 8080;

const connectedUsers = new Map<WebSocket, ClientInfo>(); 
const messages: Message[] = [];                 // histórico

const wss = new WebSocketServer({
    port: PORT,
    host: "0.0.0.0"
});

console.log(`🚀 WebSocket rodando em ws://0.0.0.0:${PORT}`);

function broadcast(data: any) {
    const json = JSON.stringify(data);
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    }
}

wss.on("connection", (socket) => {
    console.log("🔌 Novo cliente conectado.");

    socket.on("message", (raw) => {
        let msg: any;
        try {
            msg = JSON.parse(raw.toString());
        } catch {
            return socket.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
        }

        // --------------------------
        // LOGIN
        // --------------------------
        if (msg.type === "login") {
            const { username } = msg;

            if (!username || typeof username !== "string") {
                return socket.send(JSON.stringify({ type: "login_error", message: "Invalid username." }));
            }

            // ❗ Agora só checa se já existe alguém ONLINE com esse username
            const alreadyOnline = Array.from(connectedUsers.values())
                .some(u => u.username === username);

            if (alreadyOnline) {
                return socket.send(JSON.stringify({
                    type: "login_error",
                    message: "Username is already in use."
                }));
            }

            connectedUsers.set(socket, { socket, username });

            console.log(`👤 ${username} entrou.`);

            socket.send(JSON.stringify({
                type: "login_success",
                messages,
                users: Array.from(connectedUsers.values()).map(u => u.username)
            }));

            broadcast({
                type: "user_joined",
                username,
                users: Array.from(connectedUsers.values()).map(u => u.username)
            });

            return;
        }

        // --------------------------
        // NOVA MENSAGEM
        // --------------------------
        if (msg.type === "message") {
            const client = connectedUsers.get(socket);
            if (!client) return;

            const newMessage: Message = {
                owner: client.username,
                message: msg.message
            };

            messages.push(newMessage);

            broadcast({
                type: "new_message",
                message: newMessage
            });
        }

        // --------------------------
        // LOGOUT
        // --------------------------
        if (msg.type === "logout") {
            const info = connectedUsers.get(socket);
            if (info) {
                console.log(`👋 ${info.username} saiu voluntariamente.`);
                connectedUsers.delete(socket);

                broadcast({
                    type: "user_left",
                    username: info.username
                });
            }
        }
    });

    // --------------------------
    // QUEDA DE CONEXÃO
    // --------------------------
    socket.on("close", () => {
        const info = connectedUsers.get(socket);

        if (info) {
            console.log(`⚠️ ${info.username} desconectou.`);
            connectedUsers.delete(socket);

            broadcast({
                type: "user_disconnected",
                username: info.username
            });
        }
    });
});

// --------------------------
// SERVER CRASH
// --------------------------
wss.on("close", () => {
    broadcast({ type: "server_down" });
});
