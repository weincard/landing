import { apiClient } from "./client";
import type { AuthUser } from "@/types";

export const requestOtp = (phone: string) =>
  apiClient.post("/auth/request-otp", { phone: `+57${phone}` });

export const verifyOtp = (phone: string, code: string) =>
  apiClient.post<{ accessToken: string }>("/auth/verify-otp", {
    phone: `+57${phone}`,
    code,
  });

export const getMe = () => apiClient.get<AuthUser>("/auth/me");

export const forgotPassword = (email: string) =>
  apiClient.post<{ sent: boolean }>("/auth/email/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  apiClient.post<{ success: boolean }>("/auth/email/reset-password", { token, password });
