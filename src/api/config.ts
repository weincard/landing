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
  /** Editable copy + kill switch for the b2b "cancel your Apple IAP sub"
   *  notice. `{orgName}` in title/body1/body2 is interpolated at render time.
   *  Absent or `enabled: false` → the notice never shows. */
  iapCancelNotice?: {
    enabled: boolean;
    title?: string;
    body1?: string;
    body2?: string;
    ctaLabel?: string;
    alreadyCancelledLabel?: string;
    dismissLabel?: string;
  };
}

export const getAppConfig = () => honoClient.get<PublicAppConfig>("/config/app");
