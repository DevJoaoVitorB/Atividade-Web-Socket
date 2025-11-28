'use client'

import { useChatContext } from "@/app/contextChat/ContextChat"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";

export default function MessageArea() {
    const { state } = useChatContext();
    const { username, connection, messages } = state;

    return (
        <div>
            <div className="bg-white flex flex-col gap-2 max-h-[512px] overflow-y-auto p-6 shadow-md rounded-md">
                { !connection 
                    ? (
                        <p className="text-center">Entre no Chat para Visualizar as Mensagens!</p>
                    )
                    : messages.length === 0 
                        ? (
                            <p className="text-center">Nenhuma Mensagem No Momento!</p>
                        )
                        : messages.map((message, index) => {
                            return (
                                <div 
                                    key={index} 
                                    className={`
                                        ${ username === message.owner 
                                            ? "bg-green-900 ml-auto rounded-l-md rounded-tr-md" 
                                            : "bg-slate-800 mr-auto rounded-r-md rounded-tl-md"
                                        } text-white 
                                        flex flex-col gap-2 
                                        w-fit p-2.5
                                    `}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <Avatar>
                                            <AvatarImage
                                                src="./avatar.png"
                                            />
                                            <AvatarFallback>
                                                <User className="text-slate-800 w-6 h-6"/>
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="px-1.5">{message.owner}</span>
                                    </div>

                                    <span>{message.message}</span>
                                </div>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}