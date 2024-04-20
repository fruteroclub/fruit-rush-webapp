import AuthenticatedPage from "@/components/layout/authenticatedPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <AuthenticatedPage>
      <div className="flex w-full max-w-3xl items-center justify-between">
        <h2>Rollups</h2>
        <Link href="/rollups/create">
          <Button>+ New Rollup</Button>
        </Link>
      </div>
    </AuthenticatedPage>
  );
}
