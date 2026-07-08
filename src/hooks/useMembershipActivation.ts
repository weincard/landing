import { useEffect, useRef } from "react";

const TOKEN_KEY = "wc_access_token";

// WebSocket API endpoint (separate from the HTTP API). Set VITE_HONO_WS_URL to
// the wss:// url printed by `sst deploy` (output: wsUrl), e.g.
//   wss://abc123.execute-api.us-east-2.amazonaws.com/production
// The token is passed as a query param because browsers can't set headers on a
// WebSocket handshake; the backend $connect handler verifies it.
const WS_URL = (import.meta.env.VITE_HONO_WS_URL ?? "").trim();

// Hard stop so a never-arriving activation doesn't keep a socket open forever
// (mirrors the old 3-minute polling timeout).
const MAX_WAIT_MS = 180_000;
// Reconnect backoff if the socket drops while we're still waiting.
const RECONNECT_DELAY_MS = 3_000;

type ActivationMessage = { type?: string; membershipId?: string };

/**
 * Replaces the old post-checkout polling loop. While `enabled` is true, holds an
 * open WebSocket to the backend and invokes `onActivation` when the membership
 * activates. Also calls `onActivation` once immediately on connect as a race
 * guard — the Treli webhook may land before the socket connects, and that single
 * refresh (not a loop) catches the already-active case.
 */
export function useMembershipActivation(
  enabled: boolean,
  onActivation: () => void,
) {
  // Keep the latest callback without re-opening the socket on every render.
  const onActivationRef = useRef(onActivation);
  onActivationRef.current = onActivation;

  useEffect(() => {
    if (!enabled) return;

    if (!WS_URL) {
      console.warn(
        "[useMembershipActivation] VITE_HONO_WS_URL not set — realtime activation disabled",
      );
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;

    const stopTimer = setTimeout(() => {
      stopped = true;
      socket?.close();
    }, MAX_WAIT_MS);

    function connect() {
      if (stopped) return;
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;

      socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

      socket.onopen = () => {
        // Race guard: the webhook may already have activated the membership
        // before this socket connected. One refresh catches that.
        onActivationRef.current();
      };

      socket.onmessage = (event) => {
        try {
          const msg: ActivationMessage = JSON.parse(event.data);
          if (msg.type === "subscription_activated") {
            onActivationRef.current();
          }
        } catch {
          // Ignore non-JSON frames.
        }
      };

      socket.onclose = () => {
        if (stopped) return;
        // Dropped while still waiting — retry.
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };

      socket.onerror = () => {
        socket?.close();
      };
    }

    connect();

    return () => {
      stopped = true;
      clearTimeout(stopTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket) {
        socket.onclose = null; // prevent reconnect on intentional teardown
        socket.close();
      }
    };
  }, [enabled]);
}
