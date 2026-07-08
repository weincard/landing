import { useEffect, useRef } from "react";

const TOKEN_KEY = "wc_access_token";

// WebSocket API endpoint (separate from the HTTP API). Set VITE_HONO_WS_URL to
// the wss:// url printed by `sst deploy` (output: wsUrl). SST deploys the WS API
// on the "$default" stage, so the path is /$default — NOT /production or /dev.
// In .env the $ must be escaped (\$default) or Vite's dotenv-expand eats it:
//   wss://abc123.execute-api.us-east-2.amazonaws.com/\$default
// The token is passed as a query param because browsers can't set headers on a
// WebSocket handshake; the backend $connect handler verifies it.
const WS_URL = (import.meta.env.VITE_HONO_WS_URL ?? "").trim();

// Hard stop so a never-arriving activation doesn't keep a socket open forever.
// A real Treli checkout (card entry + 3DS + webhook delivery) routinely takes
// longer than a few minutes, so keep this generous — but under API Gateway's
// 10-minute idle-disconnect limit (we send no keepalive pings).
const MAX_WAIT_MS = 540_000; // 9 minutes
// Reconnect backoff — exponential and capped. A socket that never opened (bad or
// stale endpoint) gives up after MAX_FAILED_ATTEMPTS so a failing URL can't
// produce a connection storm; a genuine drop after a successful open retries
// promptly.
const BASE_RECONNECT_MS = 2_000;
const MAX_RECONNECT_MS = 30_000;
const MAX_FAILED_ATTEMPTS = 5;

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
    let everOpened = false;
    let failedAttempts = 0;

    const stopTimer = setTimeout(() => {
      stopped = true;
      socket?.close();
    }, MAX_WAIT_MS);

    function scheduleReconnect() {
      if (stopped) return;

      // Genuine mid-wait drop (we had a live connection) — reset and retry soon.
      if (everOpened) {
        everOpened = false;
        failedAttempts = 0;
        reconnectTimer = setTimeout(connect, BASE_RECONNECT_MS);
        return;
      }

      // Never established — exponential backoff, and give up after a few tries so
      // a bad/stale endpoint can't hammer the server with a reconnect storm.
      failedAttempts += 1;
      if (failedAttempts > MAX_FAILED_ATTEMPTS) {
        console.warn(
          "[useMembershipActivation] WebSocket failed to connect repeatedly — giving up (check VITE_HONO_WS_URL / API Gateway route wiring)",
        );
        return;
      }
      const delay = Math.min(
        BASE_RECONNECT_MS * 2 ** (failedAttempts - 1),
        MAX_RECONNECT_MS,
      );
      reconnectTimer = setTimeout(connect, delay);
    }

    function connect() {
      if (stopped) return;
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;

      socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

      socket.onopen = () => {
        everOpened = true;
        failedAttempts = 0;
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
        scheduleReconnect();
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
