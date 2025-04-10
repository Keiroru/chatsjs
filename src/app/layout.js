import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/lib/socket";
import { TranslationProvider } from "@/contexts/TranslationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chat App",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          charSet="UTF-8"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}>
        <TranslationProvider>
          <SocketProvider>
            <main className="flex-grow">
              {children}
            </main>
          </SocketProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
