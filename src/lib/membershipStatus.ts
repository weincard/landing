// The only statuses that grant member access. Must stay in sync with
// APP_ACCESS_STATUSES in hono-lambdas (@wein/core membership.entity) and
// MembershipStatus.isActive in the Flutter app. Deliberately excludes
// unpaid/past_due (payment-retry states, decided 2026-08-14): a lapsed payment
// means no access until Treli recovers it.
export const ACTIVE_MEMBERSHIP_STATUSES = [
  "active",
  "pending_cancel",
  "trialing",
] as const;

export function isActiveMembershipStatus(status: string | null | undefined): boolean {
  return (ACTIVE_MEMBERSHIP_STATUSES as readonly string[]).includes(status ?? "");
}
