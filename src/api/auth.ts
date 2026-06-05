import { honoClient } from "./honoClient";
import type { AuthUser } from "@/types";

export const requestOtp = (phone: string) =>
  honoClient.post("/auth/request-otp", { phone: `+57${phone}` });

export const verifyOtp = (phone: string, code: string) =>
  honoClient.post<{ accessToken: string }>("/auth/verify-otp", {
    phone: `+57${phone}`,
    code,
  });

export const getMe = () => honoClient.get<AuthUser>("/auth/me");

export const forgotPassword = (email: string) =>
  honoClient.post<{ sent: boolean }>("/auth/email/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  honoClient.post<{ success: boolean }>("/auth/email/reset-password", { token, password });
