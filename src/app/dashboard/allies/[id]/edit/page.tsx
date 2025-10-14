import { CookiesKeysEnum } from "@/utilities";
import { getUserCookiesServer } from "@/utilities/helpers/handleUserCookies/getUserCookieServer";
import { CreateOrEditAlly } from "@/views/Allies/components/CreateOrEditAlly";
import { cookies } from "next/headers";
import React from "react";

export default async function EditAllyPage({ params }: any) {
  const { id } = await params;
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;
  const user = await getUserCookiesServer();
  console.log("PARAMS ID:", id);
  if (!token || !user) {
    return <div>No access</div>;
  }
  return <CreateOrEditAlly allyId={id} token={token} user={user} />;
}
