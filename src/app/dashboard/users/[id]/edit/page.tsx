import { CookiesKeysEnum } from "@/utilities";
import { getUserCookiesServer } from "@/utilities/helpers/handleUserCookies/getUserCookieServer";
import { CreateOrEditUser } from "@/views/Users/CreateOrEditUser";
import { cookies } from "next/headers";
import React from "react";

export default async function EditUserPage({ params }: any) {
  const { id } = await params;
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;
  const user = await getUserCookiesServer();
  console.log("PARAMS ID:", id);
  if (!token || !user) {
    return <div>No access</div>;
  }
  return <CreateOrEditUser userId={id} token={token} />;
}
