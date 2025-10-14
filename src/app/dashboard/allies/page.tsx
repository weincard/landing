import { CookiesKeysEnum } from "@/utilities";
import { AlliesView } from "@/views/Allies/Allies";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function AlliesPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <AlliesView token={token} />
    </Suspense>
  );
}
