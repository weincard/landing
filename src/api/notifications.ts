import { honoClient } from "./honoClient";

/**
 * Stateless email-notification opt-out endpoints. The token comes from the
 * unsubscribe link embedded in every notification email — no auth required.
 */
export const unsubscribeEmail = (token: string) =>
  honoClient.post<{ message: string }>("/notifications/email/unsubscribe", {
    token,
  });

export const resubscribeEmail = (token: string) =>
  honoClient.post<{ message: string }>("/notifications/email/resubscribe", {
    token,
  });
