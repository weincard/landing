import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { PlanKey } from "@/types";

// Treli's session/create uses the account email as the customer identifier, so
// the email must be verified before we open checkout. This gate opens the
// URL-synced VerifyContactModal (mounted at the router root) carrying a
// `then=checkout` intent, so verification resumes straight into the payment.
//
// Returns true when it gated — callers MUST stop their checkout when it does.
// Assumes the email to be charged is already saved on the account (every
// checkout path saves it first), so the modal verifies `user.email`.
export function useEmailVerificationGate() {
  const { user } = useAuth();
  const [, setParams] = useSearchParams();

  return useCallback(
    (plan: PlanKey): boolean => {
      // No session / no email yet → not our concern; the caller routes the user
      // to registro or its own email-capture step.
      if (!user || !user.email) return false;
      if (user.isEmailVerified) return false;

      setParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set("verify", "email");
        p.set("then", "checkout");
        p.set("plan", plan);
        return p;
      });
      return true;
    },
    [user, setParams],
  );
}
