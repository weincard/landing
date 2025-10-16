import { CookiesKeysEnum } from "@/utilities";
import { CreateOrEditCoupon } from "@/views/Coupons/components/CreateOrEditCoupon";
import { cookies } from "next/headers";
import React from "react";

export default async function EditCouponPage({ params }: any) {
  const { id } = await params;
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return <CreateOrEditCoupon couponId={id} token={token} />;
}
