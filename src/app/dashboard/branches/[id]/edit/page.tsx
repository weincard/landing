import { CreateOrEditBranch } from "@/views/Branches/components/CreateOrEditBranch";
import { CookiesKeysEnum } from "@/utilities";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;
  const { id } = await params;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <CreateOrEditBranch token={token} branchId={id} />
    </Suspense>
  );
}
