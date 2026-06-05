import { honoClient } from "./honoClient";
import type {
  Branch,
  Category,
  TypesenseGroupedResponse,
  TypesenseOfferDocument,
  Offer,
} from "@/types";

const TYPESENSE_HOST = import.meta.env.VITE_TYPESENSE_HOST;
const TYPESENSE_API_KEY = import.meta.env.VITE_TYPESENSE_API_KEY;

function groupedHitToBranch(
  groupKey: (string | number)[],
  hits: Array<{ document: TypesenseOfferDocument }>
): Branch {
  const first = hits[0].document;
  const branchId =
    typeof groupKey[0] === "number"
      ? groupKey[0]
      : parseInt(String(groupKey[0]), 10);

  const offers: Offer[] = hits.map(({ document: doc }) => ({
    offerId: parseInt(doc.id, 10),
    title: doc.title,
    description: doc.description,
    offerType: doc.offerType,
    value: doc.value,
    conditions: doc.conditions,
    validFrom: new Date(doc.validFrom * 1000).toISOString(),
    validTo: doc.validTo ? new Date(doc.validTo * 1000).toISOString() : null,
    validDays: doc.validDays ?? [],
    isActive: doc.isActive,
    expiresAt: doc.expiresAt
      ? new Date(doc.expiresAt * 1000).toISOString()
      : null,
    excludesBankHolidays: doc.excludesBankHolidays,
  }));

  return {
    branchId,
    name: first.branchName ?? "",
    slug: "",
    description: "",
    address: "",
    city: first.city ?? "",
    country: first.country ?? "",
    phone: "",
    whatsapp: "",
    canContact: false,
    email: "",
    website: "",
    logoUrl: first.logoUrl ?? "",
    coverImageUrl: first.coverImageUrl ?? null,
    note: "",
    isActive: true,
    images: first.images ?? [],
    tags: null,
    createdAt: "",
    category: {
      categoryId: first.categoryId ?? 0,
      name: first.categoryName ?? "",
      description: "",
      image: "",
      slug: "",
    },
    merchant: {
      merchantId: first.merchantId ?? 0,
      name: first.merchantName ?? "",
      description: "",
      logoUrl: "",
      country: first.country ?? "",
      state: "",
      founder: false,
      createdAt: "",
    },
    offers,
    favoritesCount: 0,
  };
}

export async function searchBranches(
  query: string,
  page: number
): Promise<{ branches: Branch[]; found: number }> {
  const params = new URLSearchParams({
    q: query.trim() || "*",
    query_by: "branchName,title,description",
    group_by: "branchId",
    group_limit: "10",
    per_page: "10",
    page: String(page),
    filter_by: "isActive:true && branchId:>0",
  });

  const res = await fetch(
    `https://${TYPESENSE_HOST}/collections/offers/documents/search?${params}`,
    { headers: { "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY } }
  );

  if (!res.ok) throw new Error("Error al cargar los restaurantes.");

  const data: TypesenseGroupedResponse = await res.json();
  return {
    branches: data.grouped_hits.map((g) =>
      groupedHitToBranch(g.group_key, g.hits)
    ),
    found: data.found,
  };
}

// ─── REST API endpoints ───────────────────────────────────────────────────────

export interface BranchFilterParams {
  name?: string;
  categoryIds?: number[];
  offerTypes?: string[];
  validDays?: string[];
  limit?: number;
  skip?: number;
  cursorDistance?: number;
  cursorBranchId?: number;
}

export interface BranchFilterResponse {
  branches: Branch[];
  count: number;
  nextCursor: { cursorDistance: number; cursorBranchId: number } | null;
}

export const filterBranches = (params: BranchFilterParams) =>
  honoClient.post<BranchFilterResponse>("/branches/filter", params);

export const getBranchById = (branchId: number) =>
  honoClient.get<{ branch: Branch }>(`/branches/one/${branchId}`);

export const getCategories = () =>
  honoClient.get<{ categories: Category[] }>("/categories/all");
