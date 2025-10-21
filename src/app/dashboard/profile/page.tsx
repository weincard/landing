import ProfileView from "@/views/Profile/ProfileView";
import { getUserCookiesServer } from "@/utilities/helpers/handleUserCookies/getUserCookieServer";
import { cookies } from "next/headers";
import { CookiesKeysEnum } from "@/utilities";
import React from "react";

export default async function ProfilePage() {
  const user = await getUserCookiesServer();
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!user || !token) {
    return <div>No access</div>;
  }

  return <ProfileView user={user} token={token} />;
}
