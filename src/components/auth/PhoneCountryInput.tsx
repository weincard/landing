import { COUNTRIES, type Country } from "@/lib/countries";

// Phone field with a country dial-code dropdown, matching the funnel's inline
// look (used in RegistroFlow's data step and the VerifyContactModal). The parent
// owns `country` + `number` state; compose the stored value with composePhone().

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#374151",
  marginBottom: "6px",
};

export function PhoneCountryInput({
  country,
  number,
  onCountryChange,
  onNumberChange,
  label = "Número de celular",
  required,
  disabled,
  autoFocus,
}: {
  country: Country;
  number: string;
  onCountryChange: (c: Country) => void;
  onNumberChange: (n: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#FF3B47" }}>*</span>}
      </label>
      <div style={{ display: "flex" }}>
        <select
          aria-label="Código de país"
          value={country.code}
          disabled={disabled}
          onChange={(e) => {
            const next = COUNTRIES.find((c) => c.code === e.target.value);
            if (next) onCountryChange(next);
          }}
          style={{
            padding: "12px 8px",
            border: "1px solid #d1d5db",
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            fontSize: "13px",
            fontFamily: "inherit",
            background: disabled ? "#f3f4f6" : "#f9fafb",
            color: "#4b5563",
            cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
            maxWidth: "104px",
            boxSizing: "border-box",
          }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={number}
          disabled={disabled}
          autoFocus={autoFocus}
          onChange={(e) => onNumberChange(e.target.value.replace(/\D/g, "").slice(0, 15))}
          placeholder="3001234567"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "12px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "0 8px 8px 0",
            fontSize: "14px",
            outline: "none",
            fontFamily: "inherit",
            background: disabled ? "#f3f4f6" : "#fff",
            color: disabled ? "#6b7280" : "inherit",
            cursor: disabled ? "not-allowed" : "text",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
