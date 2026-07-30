import { honoClient } from "./honoClient";

/**
 * Stateless b2b import-conflict resolution. The 30-day purpose-scoped token
 * comes from the "Acción requerida para unirte a ..." email — no auth needed.
 * The registered phone only ever arrives MASKED (e.g. "***2776"): the inbox
 * holder doesn't necessarily own that account.
 */

export interface ConflictInfo {
  status: "open" | "resolved";
  orgName: string;
  csvName: string;
  csvPhone: string;
  maskedExistingPhone: string;
}

export type ConflictAction = "attach" | "create";

export const getConflictInfo = (token: string) =>
  honoClient.get<ConflictInfo>(`/b2b/conflicts/${encodeURIComponent(token)}`);

export const resolveConflict = (token: string, action: ConflictAction) =>
  honoClient.post<{ message: string; action: ConflictAction }>(
    `/b2b/conflicts/${encodeURIComponent(token)}/resolve`,
    { action },
  );
