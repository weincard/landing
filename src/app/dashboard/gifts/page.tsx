import { CookiesKeysEnum } from "@/utilities";
import { GiftsView } from "@/views/Gifts/Gifts";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function GiftsPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <GiftsView token={token} />
    </Suspense>
  );
}
