import { useCallback, useState } from "react";
import { httpClient } from "@/config/http-client";

export interface UserMetricsResponse {
  metrics: Array<{
    year: number;
    month: number;
    client: number;
    owner: number;
  }>;
}

export const useUserMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserRegistrationMetrics = useCallback(
    async (
      year: number,
      token?: string
    ): Promise<UserMetricsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await httpClient.post<UserMetricsResponse>(
          "/users/metrics/registrations",
          { year },
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
          "Error al cargar métricas de usuarios";
        setError(errorMessage);
        console.error("Error getting user metrics:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getUserRegistrationMetrics,
    loading,
    error,
  };
};
