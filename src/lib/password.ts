// Password policy for the public web. This MUST stay in sync with the Flutter
// app's email-auth rule, otherwise a user can set a password here that the
// mobile app's login form rejects — locking them out on mobile.
//
// Flutter source of truth:
//   weincard-movil-app/lib/.../email_auth_bloc/email_auth_state.dart  (emptyPassword)
//   weincard-movil-app/lib/.../inputs/app_form_input/form_password.dart (getErrors)
// Rule: min 8 chars, >= 1 uppercase, >= 1 lowercase, >= 1 number.
// Special characters are NOT required.
export const PASSWORD_MIN_LENGTH = 8;

/// Returns a Spanish error message describing the first unmet requirement, or
/// `null` when the password satisfies the policy. The check order mirrors the
/// Flutter validator so the messaging is consistent across platforms.
export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe incluir al menos una letra mayúscula.";
  }
  if (!/[a-z]/.test(password)) {
    return "La contraseña debe incluir al menos una letra minúscula.";
  }
  if (!/[0-9]/.test(password)) {
    return "La contraseña debe incluir al menos un número.";
  }
  return null;
}

/// Short human-readable summary of the policy, suitable for hint text under a
/// password field.
export const PASSWORD_REQUIREMENTS_HINT =
  "Mínimo 8 caracteres, con al menos una mayúscula, una minúscula y un número.";
