"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { arbitrum, arbitrumSepolia, sepolia } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ""}
      config={{
        loginMethods: ["google"],
        appearance: {
          theme: "light",
          accentColor: "#3730a3",
          logo: "https://i.ibb.co/gPVq7Sv/kukulcan-auth.png",
        },
        embeddedWallets: {
          createOnLogin: "off",
        },
        defaultChain: sepolia,
        supportedChains: [arbitrum, arbitrumSepolia, sepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
