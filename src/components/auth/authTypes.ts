export type AuthMode = "login" | "register" | "checkout";
export type Step = "phone" | "otp" | "profile" | "email";

export const STEPS_FOR_MODE: Record<AuthMode, Step[]> = {
  login: ["phone", "otp"],
  register: ["phone", "otp", "profile"],
  checkout: ["phone", "otp", "profile"],
};
