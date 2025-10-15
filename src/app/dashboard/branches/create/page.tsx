import { CreateOrEditBranch } from "@/views/Branches/components/CreateOrEditBranch";
import { CookiesKeysEnum } from "@/utilities";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function CreateBranchPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <CreateOrEditBranch token={token} />
    </Suspense>
  );
}
