import CreateOrEditGift from "@/views/Gifts/components/CreateOrEditGift";
import { CookiesKeysEnum } from "@/utilities";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function CreateGiftPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <CreateOrEditGift token={token} />
    </Suspense>
  );
}
