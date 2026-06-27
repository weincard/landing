import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";
import { Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BranchBrowser } from "@/components/catalog/BranchBrowser";
import type { Branch } from "@/types";

// Persistent "Usar mi Weincard" pill, mirroring the mobile app: shown across the
// /app shell for logged-in active members, it opens a restaurant picker and then
// routes to that branch's redeem screen. It is HIDDEN where a direct in-context
// action already exists — the branch-detail page (which has its own button) and
// the redeem page itself.
function isHiddenRoute(pathname: string): boolean {
  return (
    /^\/app\/explore\/[^/]+$/.test(pathname) || // branch detail
    /^\/app\/redeem\//.test(pathname) // redeem screen
  );
}

export function UsarWeincardButton() {
  const { isLoggedIn, hasMembership } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  // Gate: only logged-in users with an active membership (matches the mobile gate).
  if (!isLoggedIn || !hasMembership || isHiddenRoute(pathname)) return null;

  function pick(branch: Branch) {
    setOpened(false);
    navigate(`/app/redeem/${branch.branchId}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpened(true)}
        style={{
          position: "fixed",
          left: "50%",
          bottom: "20px",
          transform: "translateX(-50%)",
          zIndex: 44,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "14px 26px",
          borderRadius: "9999px",
          background: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 700,
          fontSize: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <Zap size={18} /> Usar mi weincard
      </button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="¿En qué restaurante estás?"
        size="lg"
        radius="lg"
        centered
      >
        <BranchBrowser onOpenBranch={pick} />
      </Modal>
    </>
  );
}
