import { honoClient } from "./honoClient";
import type { AuthUser } from "@/types";

// ───────────────────────── User normalization ──────────────────────────────
// hono returns the user wrapped (`{ user: {...} }`) with `userId` + a `role`
// object, and stores the display name tilde-joined (`first~last`). Flatten it
// into the client `AuthUser` shape so every consumer reads a stable contract.
type RawUser = {
  userId: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  profileUrl?: string | null;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  role?: { name?: string | null } | string | null;
  createdAt?: string;
};

export function mapAuthUser(raw: RawUser): AuthUser {
  const rawName = raw.name ?? "";
  // Names created via complete-registration are joined with `~`; legacy ones
  // (updateUser) used a space. Support both.
  const [firstName, ...rest] = rawName.split(/[~ ]/).filter(Boolean);
  const lastName = rest.join(" ");
  const role =
    typeof raw.role === "string" ? raw.role : (raw.role?.name ?? null);
  return {
    id: raw.userId,
    userId: raw.userId,
    name: rawName ? rawName.replace(/~/g, " ") : null,
    firstName: firstName ?? null,
    lastName: lastName || null,
    email: raw.email ?? null,
    phone: raw.phone ?? null,
    document: raw.document ?? null,
    profileUrl: raw.profileUrl ?? null,
    role,
    isVerified: raw.isVerified,
    isEmailVerified: raw.isEmailVerified,
    isPhoneVerified: raw.isPhoneVerified,
    createdAt: raw.createdAt,
  };
}

export const getMe = async (): Promise<AuthUser> => {
  const res = await honoClient.get<{ user: RawUser }>("/auth/me");
  return mapAuthUser(res.data.user);
};

// ───────────────────────────── Phone (OTP) ─────────────────────────────────
export const requestOtp = (phone: string) =>
  honoClient.post<{ newUser: boolean; message: string }>("/auth/request-otp", {
    phone: `+57${phone}`,
  });

export const verifyOtp = (phone: string, code: string) =>
  honoClient.post<{ accessToken: string }>("/auth/verify-otp", {
    phone: `+57${phone}`,
    code,
  });

// ──────────────── Authenticated phone attach + verify (profile) ─────────────
// Unlike requestOtp/verifyOtp (the login funnel, which find-or-create a user BY
// phone and mint a new session), these attach + verify a phone onto the CURRENT
// logged-in account. The Bearer token is added by the honoClient interceptor.
// `phone` is the full E.164 string (dial code + number) from the country picker.
export const phoneAttachRequestOtp = (phone: string) =>
  honoClient.post<{ message: string }>("/auth/phone/attach/request-otp", {
    phone,
  });

export const phoneAttachVerifyOtp = (phone: string, code: string) =>
  honoClient.post<{ message: string; isVerified: boolean }>(
    "/auth/phone/attach/verify-otp",
    { phone, code },
  );

// ─────────────────────── Account deletion (public, OTP) ────────────────────
// Store-compliance self-service deletion. The user proves ownership of the
// account by receiving a one-time code on the SAME channel that identifies it
// (phone or email); the account tied to that identifier is then anonymized +
// soft-deleted. No login session is created. For phone, callers pass the
// 10-digit local number — we prepend +57 to match the rest of the app.
export type DeleteChannel = "phone" | "email";

export const requestDeleteOtp = (channel: DeleteChannel, value: string) =>
  honoClient.post<{ found: boolean }>("/auth/delete-account/request-otp", {
    channel,
    value: channel === "phone" ? `+57${value}` : value,
  });

export const confirmDeleteAccount = (
  channel: DeleteChannel,
  value: string,
  code: string,
) =>
  honoClient.post<{ message: string }>("/auth/delete-account/confirm", {
    channel,
    value: channel === "phone" ? `+57${value}` : value,
    code,
  });

// ───────────────────────────── Email + password ────────────────────────────
export const emailCheck = (email: string) =>
  honoClient.post<{ exists: boolean; verified?: boolean }>("/auth/email/check", {
    email,
  });

export const emailSendCode = (email: string) =>
  honoClient.post<{ sent: boolean }>("/auth/email/send-code", { email });

// new_user → carries an accessToken (Bearer for set-password).
// existing_unverified → carries a verificationToken instead.
export type EmailVerifyResult =
  | { type: "new_user"; accessToken: string }
  | { type: "existing_unverified"; verificationToken: string };

export const emailVerifyCode = (email: string, code: string) =>
  honoClient.post<EmailVerifyResult>("/auth/email/verify-code", { email, code });

export const emailSetPassword = (args: {
  email: string;
  password: string;
  verificationToken?: string;
}) =>
  honoClient.post<{ accessToken: string }>(
    "/auth/email/set-password",
    args,
    // For the new_user path the Bearer token (set by the interceptor after
    // login) authorizes this call; for existing_unverified the body token does.
  );

export const emailLogin = (email: string, password: string) =>
  honoClient.post<{ accessToken: string }>("/auth/email/login", {
    email,
    password,
  });

// ───────────────────────────── Password reset ──────────────────────────────
export const forgotPassword = (email: string) =>
  honoClient.post<{ sent: boolean }>("/auth/email/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  honoClient.post<{ success: boolean }>("/auth/email/reset-password", {
    token,
    password,
  });
