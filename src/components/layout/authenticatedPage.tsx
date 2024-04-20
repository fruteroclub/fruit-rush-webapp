"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import NewUserPage from "../user/newUserPage";

interface AuthenticatedPageProps {
  children: React.ReactNode;
  className?: string;
}

const AuthenticatedPage = ({ children, className }: AuthenticatedPageProps) => {
  const router = useRouter();
  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();

  const {
    isFetching,
    isError,
    data: userData,
    refetch,
  } = api.user.getById.useQuery(
    { id: user?.id ?? "" },
    {
      enabled: Boolean(ready && user?.id),
    },
  );

  async function refetchUserData() {
    await refetch();
  }

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="page space-y-4 !pt-32">
        <div
          className="text-surface inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        />
        <p className="text-xl">cargando...</p>
      </div>
    );
  }

  if (ready && !authenticated) {
    return (
      <div className="page space-y-4 !pt-32">
        <p className="text-xl">redirigiendo...</p>
      </div>
    );
  }

  if (ready && user && !userData?.user?.id) {
    console.log(user);
    const appWallet = wallets.find(
      (wallet) => wallet.walletClientType === "privy",
    );
    if (!user.google?.email || !appWallet) {
      return (
        <div className="page">
          <h4>There was an error fetching user data, please reload page</h4>
        </div>
      );
    }
    return (
      <NewUserPage
        privyUserId={user?.id}
        email={user.google?.email}
        appWallet={appWallet?.address}
        refetchUserData={refetchUserData}
      />
    );
  }

  return (
    <>
      <div className={`auth-page ${className}`}>{children}</div>
    </>
  );
};

export default AuthenticatedPage;
