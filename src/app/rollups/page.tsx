"use client";

import AuthenticatedPage from "@/components/layout/authenticatedPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Rollups() {
  const { ready, user: userData } = usePrivy();
  const { data: rollupData } = api.rollup.getAllFromUser.useQuery(
    { ownerId: userData?.id ?? "" },
    {
      enabled: Boolean(ready && userData?.id),
    },
  );

  console.log(rollupData);

  return (
    <AuthenticatedPage>
      <div className="flex w-full flex-col gap-y-6 md:max-w-2xl lg:max-w-3xl xl:max-w-5xl">
        <div className="flex w-full items-center justify-between">
          <h2>Rollups</h2>
          <Link href="/rollups/create">
            <Button>+ New Rollup</Button>
          </Link>
        </div>
        {ready && (
          <>
            {rollupData?.rollups && rollupData?.rollups.length > 0 ? (
              <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">
                {rollupData.rollups.map((rollup) => (
                  <Card
                    key={`${rollup.name}-${rollup.subdomain}-${rollup.chainId}`}
                    className="hover:cursor-pointer hover:ring-2 hover:ring-blue-500"
                  >
                    <CardContent className="py-6">
                      <div className="flex w-full gap-x-4 pb-4">
                        <Badge variant="outline" className="px-4 py-1.5">
                          Deploying
                        </Badge>
                        <Badge variant="outline" className="px-4 py-1.5">
                          Testnet
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-x-4">
                        <div className="col-span-1 flex items-center justify-center rounded-lg border bg-card p-3">
                          <Image
                            src="/images/arbitrum-logo.svg"
                            alt="Arbitrum logo"
                            height={0}
                            width={0}
                            className="aspect-square h-auto w-full"
                          />
                        </div>
                        <div className="col-span-3 flex flex-col justify-between">
                          <div>
                            <h4>{rollup.name}</h4>
                            <p className="text-sm text-gray-500">
                              {`https://${rollup.name}-rpc.fruit-rush.vercel.app`}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Created: {rollup.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex w-full flex-col items-center gap-y-6 py-12">
                <p>You currently don&apos;t have any active Rollups.</p>
                <Link href="/rollups/create">
                  <Button>Deploy New Rollup</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </AuthenticatedPage>
  );
}
