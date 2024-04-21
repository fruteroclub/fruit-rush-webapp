"use client";

import AuthenticatedPage from "@/components/layout/authenticatedPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import React, { type ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { deployRollup } from "@/helpers/deployRollup";

type FormState = {
  rollupName: string;
  subdomain: string;
  chainId: string;
};

export default function CreateNewRollup() {
  const [form, setForm] = useState<FormState>({
    rollupName: "",
    subdomain: "test",
    chainId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { user: userData } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  const createRollup = api.rollup.create.useMutation();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  console.log(wallets);

  async function handleDeployRollup() {
    if (!form.rollupName || !form.chainId) {
      return toast.warning("All fields are required!");
    }
    if (!userData?.id) {
      return toast.error("No user detected, please login again");
    }

    try {
      setIsLoading(true);
      const appWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy",
      );
      if (!appWallet) {
        return toast.error("No wallet detected, please login and try again");
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res = await deployRollup({
        wallet: appWallet,
        chainId: parseInt(form.chainId),
        chainName: form.rollupName,
      });

      const { rollup, errorMsg } = await createRollup.mutateAsync({
        ownerId: userData?.id,
        rollupName: form.rollupName,
        subdomain: form.subdomain,
        chainId: form.chainId,
      });
      if (!rollup || errorMsg) {
        toast.warning(
          errorMsg ??
            "An error occurred while deploying Rollup, please try again...",
        );
        return;
      }
      toast.success(
        `Rollup ${rollup.name} created for user ${userData.google?.email}`,
      );
      router.push("/rollups");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please check the logs");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthenticatedPage>
      <div className="flex w-full flex-col gap-y-6 md:max-w-2xl lg:max-w-3xl xl:max-w-5xl">
        <div className="justify-left flex w-full items-center gap-x-2 md:gap-x-3 lg:gap-x-4">
          <Button size="icon" variant="outline" onClick={() => router.back()}>
            <ChevronLeft />
          </Button>
          <h2>Deploy New Rollup</h2>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl">Select a stack</p>
            <Card className="col-span-2 ring-2 ring-blue-500 hover:cursor-pointer">
              <CardHeader className="py-3">
                <CardTitle className="text-xl">Arbitrum Nitro</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Corporis distinctio praesentium suscipit, quia quo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl">Select a network</p>
            <Card className="col-span-2 ring-2 ring-blue-500 hover:cursor-pointer">
              <CardHeader className="py-3">
                <CardTitle className="text-xl">Arbitrum Sepolia</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Sepolia is a testnet blockchain designed to mimic the
                  operating environment of a “mainnet” network to help
                  developers test their applications and smart contracts
                  risk-free before deploying to a production-ready mainnet
                  environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl">Native token</p>
            <div className="col-span-2 grid grid-cols-2 gap-x-8">
              <Card className="ring-2 ring-blue-500 hover:cursor-pointer">
                <CardHeader className="p-3 text-center">
                  <CardTitle className="text-xl">ETH</CardTitle>
                </CardHeader>
              </Card>
              <Card className="hover:cursor-not-allowed">
                <CardHeader className="p-3 text-center">
                  <CardTitle className="text-xl text-gray-500">
                    Custom
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl">Data availability layer</p>
            <Card className="col-span-2 ring-2 ring-blue-500 hover:cursor-pointer">
              <CardHeader className="py-3">
                <CardTitle className="text-xl">Avail</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Avail is a Web3 infrastructure layer that allows modular
                  execution layers to scale and interoperate in a trust
                  minimized way.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl">Set identifiers</p>
            <form className="col-span-2 flex flex-col gap-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="w-full space-y-2">
                <label htmlFor="rollupName" className="text-lg font-medium">
                  Rollup Name
                </label>
                <Input
                  id="rollupName"
                  name="rollupName"
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-full space-y-2">
                <label htmlFor="chainId" className="text-lg font-medium">
                  Chain ID
                </label>
                <Input
                  id="chainId"
                  name="chainId"
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl"></p>
            <div className="col-span-2">
              <Button
                size="lg"
                className="!h-12 w-full text-lg"
                onClick={handleDeployRollup}
                disabled={isLoading}
              >
                {isLoading ? "Deploying..." : "Deploy Rollup"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  );
}
