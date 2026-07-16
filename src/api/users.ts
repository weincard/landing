import { honoClient } from "./honoClient";
import type { UserStatusResponse } from "@/types";

// Allowlisted by the backend PATCH /users/update/:id handler. `email`/`phone`/
// `document`/`documentType` are editable here only while still unverified — the
// UI locks them once verified.
export const updateUser = (
  id: number,
  data: Partial<{
    name: string;
    lastname: string;
    email: string;
    phone: string;
    document: string;
    documentType: string;
  }>
) => honoClient.patch(`/users/update/${id}`, data);

export const getUserStatus = () =>
  honoClient.get<UserStatusResponse>("/users/status");

// Records a consent log row (backend stamps termsVersion, IP and user-agent).
// Same PATCH the Flutter CompleteProfileView uses; clears `consentRequired`
// on the next /users/status fetch.
export const acceptConsent = (userId: number) =>
  honoClient.patch(`/users/update/${userId}`, {
    termsAcceptedAt: new Date().toISOString(),
  });

// Canonical "finish registration" call (mirrors the Flutter app). Auth is the
// Bearer JWT obtained from phone OTP / email verify, set by the honoClient
// interceptor. `name`/`lastName` are stored tilde-joined server-side.
export interface CompleteRegistrationPayload {
  name: string;
  lastName: string;
  email: string;
  document: string;
  documentType?: string;
  /** Full E.164 phone (dial code + number). Stored unverified until OTP. */
  phone?: string;
  couponCode?: string;
  termsAcceptedAt?: string;
}

export const completeRegistration = (data: CompleteRegistrationPayload) =>
  honoClient.post<{
    success: boolean;
    membershipActivated: boolean;
    membershipExpiresAt?: string;
  }>("/users/complete-registration", data);
