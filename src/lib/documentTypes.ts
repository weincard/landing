// Document types — must match the backend `DocumentType` enum
// (packages/core/src/entities/user.entity.ts) and the Flutter app's
// kDocumentTypeOptions. NOTE: passport is "PA" (the funnel previously sent an
// invalid "PP"). "NIT" is intentionally omitted from new signups.

export interface DocumentTypeOption {
  value: string;
  label: string;
}

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { value: "CC", label: "C.C." },
  { value: "CE", label: "C.E." },
  { value: "PA", label: "Pasaporte" },
  { value: "TI", label: "T.I." },
  { value: "PEP", label: "PEP" },
];

export const DEFAULT_DOCUMENT_TYPE = "CC";

// ─────────────────────────── Document validation ───────────────────────────
// Per-type format + length rules. Numeric types reject any non-digit (this is
// what stops "beautiful laidy" and letters slipping into a C.C.); the passport
// is the only alphanumeric type. Ranges are intentionally strict to catch the
// obviously-wrong cases (e.g. an 11-digit C.C.) while still admitting real docs.
interface DocumentRule {
  label: string; // human name used in error messages
  pattern: RegExp; // allowed characters (whole string)
  min: number;
  max: number;
  alpha: boolean; // true → letters allowed (passport); false → digits only
}

const DOCUMENT_RULES: Record<string, DocumentRule> = {
  CC: { label: "C.C.", pattern: /^\d+$/, min: 6, max: 10, alpha: false },
  CE: { label: "C.E.", pattern: /^\d+$/, min: 6, max: 7, alpha: false },
  TI: { label: "T.I.", pattern: /^\d+$/, min: 10, max: 11, alpha: false },
  PA: { label: "Pasaporte", pattern: /^[A-Za-z0-9]+$/, min: 6, max: 12, alpha: true },
  PEP: { label: "PEP", pattern: /^\d+$/, min: 15, max: 15, alpha: false },
};

// Returns a Spanish error message, or null if valid. An empty value is treated
// as valid here — required-ness is enforced by the caller (registration blocks
// empty; the profile page allows leaving it blank).
export function validateDocument(
  documentType: string | undefined,
  value: string | undefined,
): string | null {
  const doc = (value ?? "").trim();
  if (!doc) return null;

  const rule = DOCUMENT_RULES[documentType ?? ""];
  if (!rule) return null; // unknown type → don't block

  if (!rule.pattern.test(doc)) {
    return rule.alpha
      ? `El ${rule.label} solo puede contener letras y números (sin espacios ni símbolos).`
      : `El número de ${rule.label} solo puede contener dígitos.`;
  }

  if (doc.length < rule.min || doc.length > rule.max) {
    const unit = rule.alpha ? "caracteres" : "dígitos";
    return rule.min === rule.max
      ? `El ${rule.label} debe tener ${rule.min} ${unit}.`
      : `El ${rule.label} debe tener entre ${rule.min} y ${rule.max} ${unit}.`;
  }

  return null;
}
