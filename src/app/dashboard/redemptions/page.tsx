import RedemptionsView from "@/views/Redemptions/Redemptions";
import { cookies } from "next/headers";
import React from "react";

export default async function RedemptionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value || "";

  return <RedemptionsView token={token} />;
}
