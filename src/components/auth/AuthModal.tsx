import { Modal } from "@mantine/core";
import type { AuthMode } from "./authTypes";
import { AuthForm } from "./AuthForm";

export type { AuthMode };

interface AuthModalProps {
  mode: AuthMode;
  opened?: boolean;
  onClose?: () => void;
  onComplete?: (email: string) => void;
  planLabel?: string;
  /** Render the form inline (no modal overlay) — used on /login and /registro pages */
  inline?: boolean;
}

export function AuthModal({
  mode,
  opened = false,
  onClose,
  onComplete,
  planLabel,
  inline = false,
}: AuthModalProps) {
  const formContent = (
    <AuthForm mode={mode} onComplete={onComplete} planLabel={planLabel} />
  );

  if (inline) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          padding: "32px",
          width: "100%",
          maxWidth: "440px",
          margin: "0 auto",
        }}
      >
        {formContent}
      </div>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose ?? (() => {})}
      withCloseButton
      size="md"
      padding="xl"
    >
      {formContent}
    </Modal>
  );
}
