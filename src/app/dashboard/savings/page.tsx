import SavingsView from "@/views/Savings/Savings";
import { cookies } from "next/headers";
import React from "react";

export default async function SavingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value || "";

  return <SavingsView token={token} />;
}
