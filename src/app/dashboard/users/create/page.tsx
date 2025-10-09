import { CookiesKeysEnum } from "@/utilities";
import { CreateOrEditUser } from "@/views/Users/CreateOrEditUser";
import { cookies } from "next/headers";
import React from "react";

export default async function CreateUserPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  return <CreateOrEditUser token={token} />;
}
