import { honoClient } from "./honoClient";
import type { MerchantCategory } from "@/types";

// GET /merchant-categories/all is public. Returns the full row; we only type the
// fields the web uses.
export const getMerchantCategories = () =>
  honoClient.get<MerchantCategory[]>("/merchant-categories/all");
