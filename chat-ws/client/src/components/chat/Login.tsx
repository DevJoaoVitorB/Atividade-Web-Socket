'use client'

import { useChatContext } from "@/app/contextChat/ContextChat";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

export default function Login() {
    const { state, setUsername, setPassword, connect, disconnect } = useChatContext();
    const { username, password, connection } = state;

    return (
        <div className="flex items-center gap-4 my-8 relative">
            {/* USERNAME */}
            <div className="relative">
                <Input 
                    id="username"
                    type="text"
                    value={username ?? ""}
                    onChange={(event) => setUsername(event.target.value.trim())}
                    disabled={connection}
                    placeholder=" "
                    className="
                      peer bg-white px-4
                      text-sm text-slate-800
                      focus-visible:outline-none
                      focus-visible:ring-0
                    "
                />
                <Label 
                    htmlFor="username"
                    className={`
                      text-slate-800 text-sm
                      absolute left-4 top-1.5
                      opacity-40
                      transition-all duration-200

                      peer-focus:opacity-90
                      peer-focus:-translate-y-8
                      peer-focus:left-1.5

                      ${
                        username
                            ? 'opacity-90 -translate-y-8 left-1.5'
                            : ''
                      }
                  `}> Username </Label>
            </div>

            {/* PASSOWRD */}
            <div className="relative">
                <Input 
                    id="search"
                    type="password"
                    value={password ?? ""}
                    onChange={(event) => setPassword(event.target.value.trim())}
                    disabled={true}
                    placeholder=" "
                    className="
                      peer bg-white px-4
                      text-sm text-slate-800
                      focus-visible:outline-none
                      focus-visible:ring-0
                    "
                />
                <Label 
                    htmlFor="search"
                    className={`
                      text-slate-800 text-sm
                      absolute left-4 top-1.5
                      opacity-40
                      transition-all duration-200

                      peer-focus:opacity-90
                      peer-focus:-translate-y-8
                      peer-focus:left-1.5

                      ${
                        password
                            ? 'opacity-90 -translate-y-8 left-1.5'
                            : ''
                      }
                  `}> Senha </Label>
            </div>

            {/* BUTTON - Connect and Desconnect */}
            <Button 
                variant="outline"
                onClick={connect}
                disabled={connection}
                className="text-slate-800 cursor-pointer"
            > Entrar </Button>
            { connection && (
              <Button 
                variant="outline"
                onClick={disconnect}
                disabled={!connection}
                className="text-slate-800 cursor-pointer"
              > Sair </Button>
              )
            }
        </div>
    )
}