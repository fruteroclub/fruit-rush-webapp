import AuthenticatedPage from "@/components/layout/authenticatedPage";
import { Button } from "@/components/ui/button";
import React from "react";

export default function page() {
  return (
    <AuthenticatedPage>
      <div className="flex w-full max-w-3xl justify-between">
        <h2>Deployments</h2>
        <Button>+ New Rollup</Button>
      </div>
    </AuthenticatedPage>
  );
}
