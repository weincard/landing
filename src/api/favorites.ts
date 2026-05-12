import { apiClient } from "./client";
import type { Favorite } from "@/types";

export const getFavorites = () =>
  apiClient.get<{ favorites: Favorite[] }>("/favorites/by-me");

export const addFavorite = (branchId: number) =>
  apiClient.post("/favorites/create", { branchId });

export const removeFavorite = (branchId: number) =>
  apiClient.delete("/favorites/remove", { data: { branchId } });
