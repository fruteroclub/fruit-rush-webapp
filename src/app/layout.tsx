import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@/lib/utils";
import WalletProvider from "@/providers/WalletProvider";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Fruit Rush",
  description: "Deploy your own L3",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <WalletProvider>
          <TRPCReactProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </TRPCReactProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
