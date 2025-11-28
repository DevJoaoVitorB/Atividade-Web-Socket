
import { ChatProvider } from "./contextChat/ContextChat";
import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "./globals.css";

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: "Chat WS",
  description: "Chat com Conexão Web Socket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.className} bg-neutral-100`}>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}
