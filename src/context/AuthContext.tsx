import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [couponRedemption, setCouponRedemption] = useState<CouponRedemptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMembership = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await getUserStatus();
      setMembership(res.data.membership ?? null);
      setCouponRedemption(res.data.couponRedemption ?? null);
    } catch {
      // silent — user session is still valid
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setMembership(null);
      setCouponRedemption(null);
      setIsLoading(false);
      return;
    }

    try {
      const [meRes, statusRes] = await Promise.all([
        getMe(),
        getUserStatus(),
      ]);
      setUser(meRes.data);
      setMembership(statusRes.data.membership ?? null);
      setCouponRedemption(statusRes.data.couponRedemption ?? null);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setMembership(null);
      setCouponRedemption(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (token: string) => {
      localStorage.setItem(TOKEN_KEY, token);
      await refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setMembership(null);
    setCouponRedemption(null);
  }, []);

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
