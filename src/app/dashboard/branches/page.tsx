import { CookiesKeysEnum } from "@/utilities";
import { BranchesView } from "@/views/Branches/Branches";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function BranchesPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <BranchesView token={token} />
    </Suspense>
  );
}
