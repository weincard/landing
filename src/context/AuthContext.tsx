import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser, Membership, PlanKey } from "@/types";
import { getMe } from "@/api/auth";
import { getMembershipsByUser } from "@/api/memberships";

const TOKEN_KEY = "wc_access_token";

function getActivePlanKey(m: Membership | null): PlanKey | null {
  if (!m) return null;
  const active = m.status === "active" || m.status === "ACTIVE";
  if (!active) return null;
  const raw = m.membershipPlan?.duration ?? m.duration;
  if (raw) {
    const u = String(raw).toUpperCase();
    if (u === "MONTHLY" || u === "MONTH") return "monthly";
    if (u === "YEARLY" || u === "YEAR") return "yearly";
  }
  const name = (
    m.membershipPlan?.name ??
    m.planName ??
    m.plan?.name ??
    ""
  ).toLowerCase();
  if (name.includes("mensual") || name.includes("monthly")) return "monthly";
  if (name.includes("anual") || name.includes("yearly") || name.includes("annual"))
    return "yearly";
  return null;
}

interface AuthContextValue {
  user: AuthUser | null;
  membership: Membership | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  hasMembership: boolean;
  activePlanKey: PlanKey | null;
  membershipName: string | null;
  membershipExpiry: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setMembership(null);
      setIsLoading(false);
      return;
    }

    try {
      const [meRes, membershipRes] = await Promise.all([
        getMe(),
        getMembershipsByUser(),
      ]);

      setUser(meRes.data);

      const raw = membershipRes.data;
      const memberships = raw?.userMemberships ?? raw;
      const m = Array.isArray(memberships) ? memberships[0] : memberships;
      setMembership(m ?? null);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setMembership(null);
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
  }, []);

  const isLoggedIn = !!user;
  const hasMembership =
    membership?.status === "active" || membership?.status === "ACTIVE";
  const activePlanKey = getActivePlanKey(membership);

  const membershipName =
    membership?.planName ??
    membership?.membershipPlan?.name ??
    membership?.plan?.name ??
    null;

  const membershipExpiry = membership?.expiresAt ?? membership?.endDate ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        membership,
        isLoading,
        isLoggedIn,
        hasMembership,
        activePlanKey,
        membershipName,
        membershipExpiry,
        login,
        logout,
        refreshUser,
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
