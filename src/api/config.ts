import { honoClient } from "./honoClient";

// Public app config (Pattern A feature flags) from GET /config/app. The endpoint
// returns more fields (banners, searchSuggestions, mundos, launchPopup,
// minBuildNumber…); we only type what this client consumes. See
// context/feature-flags.md.
export interface PublicAppConfig {
  showCouponInput: boolean;
  somosPromo?: {
    iconUrl: string;
    modalTitle: string;
    modalSubtitle: string;
    modalBody1: string;
    modalBody2: string;
    buttonLabel: string;
    whatsappEnabled: boolean;
    whatsappNumber: string;
    whatsappMessage: string;
    whatsappButtonLabel: string;
    verificationCode: string;
    allowedPlanIds: number[];
  };
}

export const getAppConfig = () => honoClient.get<PublicAppConfig>("/config/app");
