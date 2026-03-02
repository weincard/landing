import ValidationsView from "@/views/Validations/Validations";
import { cookies } from "next/headers";
import React from "react";

export default async function ValidationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value || "";

  return <ValidationsView token={token} />;
}
