"use client";

import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type NewUserPageProps = {
  privyUserId: string;
  email: string;
  appWallet: string;
  refetchUserData: () => Promise<void>;
};

export default function NewUserPage({
  privyUserId,
  email,
  appWallet,
  refetchUserData,
}: NewUserPageProps) {
  const [orgNameValue, setOrgNameValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createUserWithOrg = api.user.create.useMutation();

  async function onSubmitHandler(event: React.FormEvent) {
    event?.preventDefault();
    if (!orgNameValue || orgNameValue.length < 8) {
      toast.warning("Ambos campos son requeridos");
      return;
    }
    if (orgNameValue.length > 40) {
      toast.warning("Max 40 characters!");
      return;
    }
    setIsLoading(true);
    if (!appWallet) {
      toast.error("Missing wallet data, unable to create user");
      setIsLoading(false);
      return;
    }
    try {
      const { user, organization, errorMsg } =
        await createUserWithOrg.mutateAsync({
          id: privyUserId,
          email,
          appWallet: appWallet,
          organizationName: orgNameValue,
        });
      if (!user || errorMsg) {
        toast.warning(
          errorMsg ??
            "An error occurred while creating User, please try again...",
        );
        return;
      }
      toast.success(`Org ${organization.name} created for user ${user.email}`);
      await refetchUserData();
      router.push("/rollups");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please check the logs");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="pb-8">
        <h2>Create Organization</h2>
      </div>
      <form className="flex w-1/3 flex-col gap-y-6" onSubmit={onSubmitHandler}>
        <div className="space-y-2">
          <label htmlFor="organizationName">Name</label>
          <Input
            id="organizationName"
            placeholder="enter org name without spaces"
            onChange={(event) => setOrgNameValue(event.target.value)}
            value={orgNameValue}
          />
        </div>
        <Button disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Org"}
        </Button>
      </form>
    </div>
  );
}
