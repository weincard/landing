import { apiClient } from "./client";
import { honoClient } from "./honoClient";
import type { UserStatusResponse } from "@/types";

export const updateUser = (
  id: number,
  data: Partial<{ name: string; lastname: string; email: string }>
) => apiClient.patch(`/users/update/${id}`, data);

export const getUserStatus = () =>
  honoClient.get<UserStatusResponse>("/users/status");
