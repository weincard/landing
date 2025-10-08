import { Suspense } from "react";
import { AlliesView } from "@/views/Allies/Allies";

export default async function AlliesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="space-y-4">
        <AlliesView />
      </div>
    </Suspense>
  );
}
