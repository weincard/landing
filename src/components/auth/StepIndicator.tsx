import type { Step } from "./authTypes";

interface StepIndicatorProps {
  steps: Step[];
  current: Step;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  const currentIdx = steps.indexOf(current);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
      {steps.map((s, i) => {
        const done = currentIdx > i;
        const active = currentIdx === i;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontFamily: '"Clash Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: "11px",
                background: done ? "#FF3B47" : active ? "#000" : "#e5e7eb",
                color: done || active ? "#fff" : "#9ca3af",
                transition: "background 0.2s",
              }}
            >
              {done ? (
                <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? "#FF3B47" : "#e5e7eb",
                  transition: "background 0.2s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
