import { RegisterForm } from "@/modules/auth/components";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function RegisterPasswordPage() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin h-10 w-10 text-white" />}>
            <RegisterForm />
        </Suspense>
    );
}