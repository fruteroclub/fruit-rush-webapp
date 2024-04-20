"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import MobileMenu from "./mobileMenu";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";

export default function Navbar() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const { login } = useLogin({
    // Set up an `onComplete` callback to run when `login` completes
    onComplete(user, isNewUser, wasPreviouslyAuthenticated) {
      console.log("🔑 ✅ Login success", {
        user,
        isNewUser,
        wasPreviouslyAuthenticated,
      });
      if (isNewUser) {
        router.push("/create-org");
        return;
      }
      if (!wasPreviouslyAuthenticated) router.push("/deployments");
    },
    // Set up an `onError` callback to run when there is a `login` error
    onError(error) {
      console.log("🔑 🚨 Login error", { error });
    },
  });
  const { logout } = useLogout();
  return (
    <nav className="sticky top-0 h-16 bg-background">
      <div className="mx-auto flex h-full max-w-7xl justify-between px-4">
        <div className="flex items-center space-x-0 md:space-x-4">
          <Link
            href="/"
            className="flex items-center gap-1 px-2 text-black hover:text-primary"
          >
            <div className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="fruit rush logo"
                height={32}
                width={32}
              />
            </div>
            <span
              className={`text-3xl font-bold tracking-tighter hover:text-destructive`}
            >
              fruit rush
            </span>
          </Link>
        </div>

        {/* Primary Navbar items */}
        <div className={`hidden items-center space-x-4 lg:flex`}>
          <Button
            variant={authenticated ? "outline" : "default"}
            size="sm"
            className={`text-md`}
            onClick={authenticated ? logout : login}
          >
            {authenticated ? "Logout" : "Deploy"}
          </Button>
        </div>

        <div className="flex items-center lg:hidden">
          <MobileMenu
            authenticated={authenticated}
            login={login}
            logout={logout}
          />
        </div>
      </div>
    </nav>
  );
}
