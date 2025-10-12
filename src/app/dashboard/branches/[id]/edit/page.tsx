import { CreateOrEditBranch } from "@/views/Branches/components/CreateOrEditBranch";
import React from "react";

export default async function EditBranchPage({
  params,
}: {
  params: { id: string };
}) {
  return <CreateOrEditBranch branchId={params.id} />;
}
