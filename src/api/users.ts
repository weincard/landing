import { apiClient } from "./client";

export const updateUser = (
  id: number,
  data: Partial<{ name: string; email: string }>
) => apiClient.patch(`/users/update/${id}`, data);
