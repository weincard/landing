import { useRef, useEffect } from "react";

// 6-digit code input shared by phone OTP and email verification (funnel + the
// VerifyContactModal). Styling comes from the global `.otp-input` class.
export function CodeInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    setTimeout(() => refs.current[0]?.focus(), 100);
  }, []);

  function handleChange(i: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  }
  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
  }
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...value];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? "";
    onChange(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="otp-input"
          aria-label={`Dígito ${i + 1}`}
        />
      ))}
    </div>
  );
}
