import { CreateOrEditAlly } from "@/views/Allies/components/CreateOrEditAlly";
import { CookiesKeysEnum } from "@/utilities";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function CreateAllyPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <CreateOrEditAlly token={token} />
    </Suspense>
  );
}
