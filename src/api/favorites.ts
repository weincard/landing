import { honoClient } from "./honoClient";
import type { Favorite } from "@/types";

export const getFavorites = () =>
  honoClient.get<{ favorites: Favorite[] }>("/favorites/by-me");

export const addFavorite = (branchId: number) =>
  honoClient.post("/favorites/create", { branchId });

export const removeFavorite = (branchId: number) =>
  honoClient.delete("/favorites/remove", { data: { branchId } });
