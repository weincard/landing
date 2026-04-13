import { useCallback, useState } from "react";
import typesenseClient from "@/lib/typesense-client";
import type { IUser, UserRole } from "@/data/interfaces/user.interface";
import type { AllUsersResponse } from "../../data/interfaces/users.response.interface";

interface UserSearchParams {
  query: string;
  role?: UserRole;
  page: number;
  perPage: number;
}

function typesenseDocToUser(doc: Record<string, any>): IUser {
  return {
    idUsuario: parseInt(doc.id),
    userId: parseInt(doc.id),
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    document: doc.document,
    documentType: doc.documentType,
    country: doc.country,
    department: doc.department,
    city: doc.city,
    address: doc.address,
    profileUrl: doc.profileUrl,
    isVerified: doc.isVerified,
    role: doc.roleName as UserRole,
    createdAt: doc.createdAt ? new Date(doc.createdAt * 1000) : undefined,
  };
}

export const useUsersTypesenseSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useCallback(
    async (params: UserSearchParams): Promise<AllUsersResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const filterConditions: string[] = [];

        if (params.role) {
          filterConditions.push(`roleName:=${params.role}`);
        }

        // Exclude soft-deleted users by default
        filterConditions.push("isDeleted:=false");

        const searchParameters: Record<string, unknown> = {
          q: params.query || "*",
          query_by: "name,email,phone,document",
          page: params.page,
          per_page: params.perPage,
          sort_by: "createdAt:desc",
          filter_by: filterConditions.join(" && "),
        };

        const result = await typesenseClient
          .collections("users")
          .documents()
          .search(searchParameters);

        const users = (result.hits || []).map((hit) =>
          typesenseDocToUser(hit.document as Record<string, any>)
        );

        return {
          users,
          count: result.found,
        };
      } catch (err: any) {
        const errorMessage = err?.message || "Error al buscar usuarios";
        setError(errorMessage);
        console.error("Error searching users in Typesense:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { searchUsers, loading, error };
};
