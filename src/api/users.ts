import { honoClient } from "./honoClient";
import type { UserStatusResponse } from "@/types";

export const updateUser = (
  id: number,
  data: Partial<{ name: string; lastname: string; email: string }>
) => honoClient.patch(`/users/update/${id}`, data);

export const getUserStatus = () =>
  honoClient.get<UserStatusResponse>("/users/status");

// Canonical "finish registration" call (mirrors the Flutter app). Auth is the
// Bearer JWT obtained from phone OTP / email verify, set by the honoClient
// interceptor. `name`/`lastName` are stored tilde-joined server-side.
export interface CompleteRegistrationPayload {
  name: string;
  lastName: string;
  email: string;
  document: string;
  documentType?: string;
  couponCode?: string;
  termsAcceptedAt?: string;
}

export const completeRegistration = (data: CompleteRegistrationPayload) =>
  honoClient.post<{
    success: boolean;
    membershipActivated: boolean;
    membershipExpiresAt?: string;
  }>("/users/complete-registration", data);
