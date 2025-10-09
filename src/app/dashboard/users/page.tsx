import { CookiesKeysEnum } from "@/utilities";
import UsersView from "@/views/Users/Users";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function UsersPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <UsersView token={token} />
    </Suspense>
  );
}
