import { CookiesKeysEnum } from "@/utilities";
import { BranchesView } from "@/views/Branches/Branches";
import { cookies } from "next/headers";

export default async function BranchesPage() {
  const token = (await cookies()).get(CookiesKeysEnum.token)?.value;

  if (!token) {
    return <div>No access</div>;
  }

  return <BranchesView token={token} />;
}
