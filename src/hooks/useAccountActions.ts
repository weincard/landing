import { useMutation } from "@tanstack/react-query";
import {
  resetPassword,
  requestDeleteOtp,
  confirmDeleteAccount,
  type DeleteChannel,
} from "@/api/auth";

// Standalone account actions (not part of the multi-step auth wizard). Each is a
// one-shot mutation so callers get `isPending`/error handling for free and every
// server call routes through TanStack.

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password).then((r) => r.data),
  });
}

export function useRequestDeleteOtp() {
  return useMutation({
    mutationFn: ({ channel, value }: { channel: DeleteChannel; value: string }) =>
      requestDeleteOtp(channel, value).then((r) => r.data),
  });
}

export function useConfirmDeleteAccount() {
  return useMutation({
    mutationFn: ({
      channel,
      value,
      code,
    }: {
      channel: DeleteChannel;
      value: string;
      code: string;
    }) => confirmDeleteAccount(channel, value, code).then((r) => r.data),
  });
}
