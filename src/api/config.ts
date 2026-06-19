import { honoClient } from "./honoClient";

// Public app config (Pattern A feature flags) from GET /config/app. The endpoint
// returns more fields (banners, searchSuggestions, mundos, launchPopup,
// minBuildNumber…); we only type what this client consumes. See
// context/feature-flags.md.
export interface PublicAppConfig {
  showCouponInput: boolean;
}

export const getAppConfig = () => honoClient.get<PublicAppConfig>("/config/app");
