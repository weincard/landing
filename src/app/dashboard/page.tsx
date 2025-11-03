import { Suspense } from "react";
import { CookiesKeysEnum } from "@/utilities";
import { getUserCookiesServer } from "@/utilities/helpers/handleUserCookies/getUserCookieServer";
import DashboardView from "@/views/Dashboard/Dashboard";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;
  const user = await getUserCookiesServer();

  if (!token || !user) {
    return <div>No tienes acceso</div>;
  }

  return (
    <Suspense fallback={<div>Cargando dashboard...</div>}>
      <DashboardView token={token} />
    </Suspense>
  );
}
