interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function FormInput({ label, required, ...inputProps }: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={inputProps.id}
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 500,
          color: "#374151",
          marginBottom: "6px",
        }}
      >
        {label} {required && <span style={{ color: "#FF3B47" }}>*</span>}
      </label>
      <input
        {...inputProps}
        required={required}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "14px",
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
          transition: "box-shadow 0.15s",
          ...(inputProps.style ?? {}),
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 2px #FF3B47";
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
          inputProps.onBlur?.(e);
        }}
      />
    </div>
  );
}
