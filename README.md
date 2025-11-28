## Documentação da Atividade - Chat em Tempo Real com WebSocket

### 🧑🏽‍💻 Desenvolvedores

|          Nome          |                                        GitHub                                        |
| :--------------------: | :----------------------------------------------------------------------------------: |
| **João Vitor Bezerra** | [![GitHub](https://skillicons.dev/icons?i=github)](https://github.com/DevJoaoVitorB) |
| **Isaac Lira Nascimento** | [![GitHub](https://skillicons.dev/icons?i=github)](https://github.com/IsaacLira42)   |

<br>

### 🎯 Objetivo

Desenvolver uma aplicação de chat em tempo real utilizando **WebSocket**, demonstrando comunicação bidirecional entre cliente e servidor, gerenciamento de múltiplas conexões simultâneas e sincronização de mensagens entre usuários conectados.

<br>

### 💼 Estudo de Caso — Chat WS

Sistema de chat em tempo real que permite múltiplos usuários se conectarem, enviarem mensagens e visualizarem mensagens de outros usuários instantaneamente. O sistema mantém histórico de mensagens e gerencia a entrada e saída de usuários.

-   **Servidor WebSocket**: gerencia conexões de clientes, autentica usuários, armazena histórico de mensagens e transmite mensagens entre todos os clientes conectados. `Porta: 8080`.
-   **Cliente Web**: interface desenvolvida em **Next.js** com autenticação de usuário, área de visualização de mensagens e campo de entrada para envio de mensagens em tempo real. `Porta: 3000`.

<br>

### 📡 Fluxo de Comunicação

#### 1. Cliente Web estabelece conexão WebSocket com o servidor (`ws://IP:8080`)

#### 2. Autenticação:

-   Cliente envia mensagem de login com username
-   Servidor valida se username está disponível
-   Se válido, servidor envia histórico de mensagens e lista de usuários online
-   Se inválido, servidor retorna erro e cliente deve tentar novamente

#### 3. Envio de Mensagens:

-   Cliente envia mensagem com tipo `message`
-   Servidor adiciona mensagem ao histórico
-   Servidor transmite mensagem para todos os clientes conectados (broadcast)

#### 4. Eventos de Usuários:

-   Quando usuário entra: servidor notifica todos os clientes
-   Quando usuário sai: servidor notifica todos os clientes e remove da lista de conectados

<br>

### 🗂️ Estrutura de Pastas

```text
chat-ws/
├── server/                     # Servidor WebSocket (Node.js + ws)
│   ├── src/
│   │   └── server.ts           # Servidor WebSocket principal
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   └── tsconfig.json
│
├── client/                     # Cliente Web (Next.js 16 + React 19)
│   ├── src/
│   │   ├── app/
│   │   │   ├── contextChat/    # Context API para gerenciamento de estado
│   │   │   │   ├── ContextChat.tsx  # Provider do contexto de chat
│   │   │   │   ├── reducer.ts       # Reducer para gerenciar estado
│   │   │   │   └── types.ts         # Tipos TypeScript
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── Login.tsx        # Componente de login
│   │   │   │   ├── MessageArea.tsx  # Área de exibição de mensagens
│   │   │   │   └── MessageInput.tsx # Campo de entrada de mensagens
│   │   │   └── ui/                  # Componentes UI (shadcn/ui)
│   │   │       ├── avatar.tsx
│   │   │       ├── button.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       └── spinner.tsx
│   │   └── lib/
│   │       └── utils.ts
│   ├── public/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

<br>

### ⚙️ Ferramentas (Stack)

|         Camada         |               Tecnologia               |               Função                |
| :--------------------: | :------------------------------------: | :---------------------------------: |
| **Servidor WebSocket** |          Node.js + ws library          | Gerenciamento de conexões WebSocket |
|    **Cliente Web**     | Next.js 16 + React 19 + Tailwind CSS 4 |   Interface de chat em tempo real   |
|   **Estado Cliente**   |     React Context API + useReducer     |   Gerenciamento de estado global    |
|   **Componentes UI**   |          shadcn/ui + Radix UI          | Componentes de interface acessíveis |
|    **Estilização**     |             Tailwind CSS 4             |       Estilização utilitária        |
|       **Ícones**       |              Lucide React              |        Biblioteca de ícones         |
|     **TypeScript**     |              TypeScript 5              |          Tipagem estática           |
|    **Gerenciador**     |                  pnpm                  |     Gerenciador de dependências     |
|      **Runtime**       |              Node.js 20+               |        Ambiente de execução         |
| **Controle de versão** |              Git + GitHub              |     Versionamento e colaboração     |

<br>

### 🚀 Como Executar o Projeto

#### Pré-requisitos

-   Node.js 20+ instalado
-   pnpm instalado (`npm install -g pnpm`)

#### 1. Clonar o Repositório

```bash
git clone https://github.com/DevJoaoVitorB/Atividade-Web-Socket.git
cd Atividade-Web-Socket/chat-ws
```

#### 2. Instalar Dependências

```bash
# No diretório do servidor
cd server
pnpm install

# No diretório do cliente
cd ../client
pnpm install
```

#### 3. Configurar o Cliente para Acesso em Rede

Para permitir acesso de outros dispositivos na rede, configure o WebSocket no cliente:

**Opção 1: Detectar IP automaticamente (Linux/WSL)**

```bash
cd client/src/app/contextChat
MY_IP=$(hostname -I | awk '{print $1}')
echo "Seu IP: $MY_IP"
# Edite ContextChat.tsx e altere a linha:
# socketRef.current = new WebSocket("ws://$MY_IP:8080");
```

**Opção 2: Configurar manualmente (Windows)**

```bash
# Execute no PowerShell para descobrir seu IP:
ipconfig | findstr IPv4

# Edite client/src/app/contextChat/ContextChat.tsx
# Altere a linha da conexão WebSocket para usar seu IP:
# socketRef.current = new WebSocket("ws://SEU_IP_AQUI:8080");
```

#### 4. Build do Cliente

⚠️ **IMPORTANTE**: O cliente Next.js precisa ser executado em modo de produção devido a limitações do Next.js 16 com WebSocket em modo desenvolvimento.

```bash
cd client
pnpm build
```

#### 5. Executar os Serviços

Abra **2 terminais** diferentes:

**Terminal 1 - Servidor WebSocket (porta 8080):**

```bash
cd server
pnpm dev
```

Você verá a mensagem: `🚀 WebSocket rodando em ws://0.0.0.0:8080`

**Terminal 2 - Cliente Web (porta 3000):**

```bash
cd client
pnpm start
```

O servidor Next.js iniciará na porta 3000 em modo produção.

#### 6. Acessar a Aplicação

-   **Acesso Local**: http://localhost:3000
-   **Acesso via Rede**: http://SEU_IP:3000 (exemplo: http://192.168.0.50:3000)

<br>

### 📋 Protocolo de Mensagens WebSocket

#### Mensagens do Cliente para o Servidor

**Login:**

```json
{
    "type": "login",
    "username": "João"
}
```

**Enviar Mensagem:**

```json
{
    "type": "message",
    "message": "Olá pessoal!"
}
```

**Logout:**

```json
{
    "type": "logout"
}
```

#### Mensagens do Servidor para o Cliente

**Login Bem-sucedido:**

```json
{
    "type": "login_success",
    "messages": [{ "owner": "Maria", "message": "Oi!" }],
    "users": ["João", "Maria"]
}
```

**Erro de Login:**

```json
{
    "type": "login_error",
    "message": "Username is already in use."
}
```

**Nova Mensagem:**

```json
{
    "type": "new_message",
    "message": {
        "owner": "João",
        "message": "Olá pessoal!"
    }
}
```

**Usuário Entrou:**

```json
{
    "type": "user_joined",
    "username": "Pedro",
    "users": ["João", "Maria", "Pedro"]
}
```

**Usuário Saiu:**

```json
{
    "type": "user_left",
    "username": "Maria"
}
```

**Usuário Desconectou:**

```json
{
    "type": "user_disconnected",
    "username": "João"
}
```

<br>

### 🔧 Funcionalidades Implementadas

#### Servidor WebSocket

-   ✅ Gerenciamento de múltiplas conexões simultâneas
-   ✅ Autenticação de usuários com validação de username único
-   ✅ Armazenamento de histórico de mensagens em memória
-   ✅ Broadcast de mensagens para todos os clientes conectados
-   ✅ Notificação de entrada e saída de usuários
-   ✅ Reconexão automática em caso de queda
-   ✅ Limpeza de recursos ao desconectar

#### Cliente Web

-   ✅ Interface responsiva com Tailwind CSS
-   ✅ Sistema de autenticação com validação
-   ✅ Visualização de mensagens em tempo real
-   ✅ Diferenciação visual entre mensagens próprias e de outros usuários
-   ✅ Avatar e identificação de usuários
-   ✅ Campo de entrada com validação
-   ✅ Reconexão automática em caso de perda de conexão
-   ✅ Alertas de status de conexão
-   ✅ Gerenciamento de estado com Context API

<br>

### 🧪 Testando a Aplicação

1. Acesse http://localhost:3000 (ou http://SEU_IP:3000)
2. Insira um username e clique em "Entrar"
3. Envie mensagens no campo de texto
4. Abra a aplicação em outra aba/navegador com username diferente
5. Observe as mensagens sendo sincronizadas em tempo real
6. Teste a desconexão fechando uma aba e veja a notificação

<br>

### 🐛 Troubleshooting

**Erro de CORS ou blocked cross-origin request:**

-   Certifique-se de que o cliente está executando em modo produção (`pnpm start`)
-   Verifique se o IP configurado no `ContextChat.tsx` está correto

**WebSocket não conecta:**

-   Verifique se o servidor WebSocket está rodando na porta 8080 (`pnpm dev`)
-   Confirme que não há firewall bloqueando a porta
-   Teste a conexão localmente primeiro (localhost)

**Cliente Next.js não inicia:**

-   Execute `pnpm build` no diretório `client` antes de `pnpm start`
-   Verifique se a porta 3000 não está em uso
-   O servidor WebSocket pode rodar em modo dev, mas o cliente Next.js deve rodar em produção

<br>

### 📚 Apresentação
[Canva - Slides do Projeto]()