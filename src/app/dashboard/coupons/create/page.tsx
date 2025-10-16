import { CreateOrEditCoupon } from "@/views/Coupons/components/CreateOrEditCoupon";
import { CookiesKeysEnum } from "@/utilities";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

export default async function CreateCouponPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return (
    <Suspense>
      <CreateOrEditCoupon token={token} />
    </Suspense>
  );
}
