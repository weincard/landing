import { useCallback, useState } from "react";
import { httpClient } from "@/config/http-client";

export interface MembershipMetricsResponse {
  count: number;
  profits: number;
}

export const useMembershipMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMembershipCountAndProfits = useCallback(
    async (token?: string): Promise<MembershipMetricsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await httpClient.get<MembershipMetricsResponse>(
          "/memberships/count-and-profits",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
        return response.data;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          "Error al cargar métricas de membresías";
        setError(errorMessage);
        console.error("Error getting membership metrics:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getMembershipCountAndProfits,
    loading,
    error,
  };
};
