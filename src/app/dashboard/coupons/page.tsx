import { CookiesKeysEnum } from "@/utilities";
import { CouponsView } from "@/views/Coupons/Coupons";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function CouponsPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <CouponsView token={token} />
    </Suspense>
  );
}
