import { useCallback, useState } from "react";
import typesenseClient from "@/lib/typesense-client";
import type { IBranch } from "@/data/interfaces/merchant.interface";
import type { AllBranchesResponse } from "../../data/interfaces/branches.response.interface";

interface BranchSearchParams {
  query: string;
  merchantId?: number;
  isActive?: boolean;
  page: number;
  perPage: number;
}

function typesenseDocToBranch(doc: Record<string, any>): IBranch {
  return {
    branchId: parseInt(doc.id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    address: doc.address,
    city: doc.city,
    country: doc.country,
    phone: doc.phone,
    whatsapp: doc.whatsapp,
    email: doc.email,
    website: doc.website,
    logoUrl: doc.logoUrl,
    coverImageUrl: doc.coverImageUrl,
    images: doc.images,
    note: doc.note,
    canContact: doc.canContact,
    isActive: doc.isActive,
    categoryId: doc.categoryId,
    merchantId: doc.merchantId,
    tags: doc.tags,
    category: doc.categoryId
      ? { categoryId: doc.categoryId, name: doc.categoryName }
      : undefined,
    merchant: doc.merchantId
      ? { merchantId: doc.merchantId, name: doc.merchantName }
      : undefined,
  };
}

export const useBranchesTypesenseSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBranches = useCallback(
    async (params: BranchSearchParams): Promise<AllBranchesResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const filterConditions: string[] = [];

        if (params.merchantId !== undefined) {
          filterConditions.push(`merchantId:=${params.merchantId}`);
        }

        if (params.isActive !== undefined) {
          filterConditions.push(`isActive:=${params.isActive}`);
        }

        const searchParameters: Record<string, unknown> = {
          q: params.query || "*",
          query_by: "name,description,tags",
          page: params.page,
          per_page: params.perPage,
          sort_by: "createdAt:desc",
        };

        if (filterConditions.length > 0) {
          searchParameters.filter_by = filterConditions.join(" && ");
        }

        const result = await typesenseClient
          .collections("branches")
          .documents()
          .search(searchParameters);

        const branches = (result.hits || []).map((hit) =>
          typesenseDocToBranch(hit.document as Record<string, any>)
        );

        return {
          branches,
          count: result.found,
        };
      } catch (err: any) {
        const errorMessage = err?.message || "Error al buscar sucursales";
        setError(errorMessage);
        console.error("Error searching branches in Typesense:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { searchBranches, loading, error };
};
