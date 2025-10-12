import { Suspense } from "react";
import { BranchesView } from "@/views/Branches/Branches";

export default async function BranchesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="space-y-4">
        <BranchesView />
      </div>
    </Suspense>
  );
}
