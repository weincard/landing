import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthUser, MembershipInfo, CouponRedemptionInfo, PlanKey } from "@/types";
import { getMe } from "@/api/auth";
import { getUserStatus } from "@/api/users";

const TOKEN_KEY = "wc_access_token";

function derivePlanKey(duration: string | null | undefined): PlanKey | null {
  if (!duration) return null;
  if (duration === "monthly") return "monthly";
  if (duration === "yearly") return "yearly";
  return null;
}

interface AuthContextValue {
  user: AuthUser | null;
  membership: MembershipInfo | null;
  couponRedemption: CouponRedemptionInfo | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasMembership: boolean;
  activePlanKey: PlanKey | null;
  membershipName: string | null;
  membershipActiveUntil: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshMembership: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface Session {
  user: AuthUser;
  membership: MembershipInfo | null;
  couponRedemption: CouponRedemptionInfo | null;
}

const SESSION_KEY = ["auth", "session"] as const;

async function fetchSession(): Promise<Session> {
  const [meRes, statusRes] = await Promise.all([getMe(), getUserStatus()]);
  return {
    user: meRes.data,
    membership: statusRes.data.membership ?? null,
    couponRedemption: statusRes.data.couponRedemption ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // The token isn't reactive on its own, so mirror it in state; login/logout
  // update it, which flips the session query on/off.
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const sessionQuery = useQuery({
    queryKey: [...SESSION_KEY, token],
    queryFn: fetchSession,
    enabled: !!token,
    retry: false,
    // An invalid/expired token is handled globally by the honoClient 401
    // interceptor (clears storage + redirects), so no manual cleanup here.
  });

  const user = sessionQuery.data?.user ?? null;
  const membership = sessionQuery.data?.membership ?? null;
  const couponRedemption = sessionQuery.data?.couponRedemption ?? null;
  // `isLoading` is false when the query is disabled (no token), so this is only
  // true while an actual session fetch is in flight.
  const isLoading = sessionQuery.isLoading;

  const refreshMembership = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: SESSION_KEY });
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: SESSION_KEY });
  }, [queryClient]);

  const login = useCallback(
    async (newToken: string) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      // Prime the cache so callers can `await login(...)` and have the session
      // ready before navigating.
      await queryClient.fetchQuery({
        queryKey: [...SESSION_KEY, newToken],
        queryFn: fetchSession,
      });
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    queryClient.removeQueries({ queryKey: SESSION_KEY });
  }, [queryClient]);

  const isLoggedIn = !!user;
  const hasMembership = ["active", "pending_cancel", "trialing", "unpaid"].includes(
    membership?.status ?? ""
  );
  const activePlanKey = hasMembership
    ? derivePlanKey(membership?.membershipPlanDuration ?? null)
    : null;
  const membershipName = membership?.membershipPlanName ?? null;
  const membershipActiveUntil =
    couponRedemption?.membershipExpiresAt ?? membership?.expiredAt ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        membership,
        couponRedemption,
        isLoading,
        isLoggedIn,
        hasMembership,
        activePlanKey,
        membershipName,
        membershipActiveUntil,
        login,
        logout,
        refreshUser,
        refreshMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
