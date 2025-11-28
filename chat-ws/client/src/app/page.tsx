
import Login from "@/components/chat/Login";
import MessageArea from "@/components/chat/MessageArea";
import MessageInput from "@/components/chat/MessageInput";

export default function Home() {
  return (
    <main className="w-96 md:w-2xl m-auto">
      <h1 className="text-slate-800 text-3xl text-center font-bold w-60 m-auto my-4">Chat WS</h1>

      {/* Estabelecer Conexão com o Web Socket */}
      <Login />

      {/* Area do Chat */}
      <MessageArea />
      <MessageInput />
      
    </main>
  );
}
