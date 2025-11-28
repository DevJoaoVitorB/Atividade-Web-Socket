'use client'

import { useChatContext } from "@/app/contextChat/ContextChat";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput() {
    const { state, sendMessage } = useChatContext();
    const { connection } = state;

    const [message, setMessage] = useState<string>("");

    return (
        <div className="flex items-center gap-4 my-6">
            <Input 
                id="search"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={!connection}
                placeholder="Escreva uma Messagem"
                className="
                    bg-white px-4 h-10
                    text-sm text-slate-800
                    focus-visible:outline-none
                    focus-visible:ring-0
                "
            />
            <Button
                variant="outline"
                size="icon-lg"
                onClick={() => {
                    sendMessage(message);
                    setMessage("");
                }}
                disabled={!connection}
                className="text-slate-800 cursor-pointer"
            > <Send/> </Button>
        </div>
    )
}