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
