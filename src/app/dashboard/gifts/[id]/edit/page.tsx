import { CookiesKeysEnum } from "@/utilities";
import { CreateOrEditGift } from "@/views/Gifts/components/CreateOrEditGift";
import { cookies } from "next/headers";
import React from "react";

export default async function EditGiftPage({ params }: any) {
  const { id } = await params;
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return <CreateOrEditGift giftId={id} token={token} />;
}
