"use client";

import { useState } from "react";
import container from "@/lib/di/container";
import { GetMeUseCase } from "../use-cases/get-me.use-case";
import type { IUser } from "@/data/interfaces/user.interface";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMe = async (token: string): Promise<IUser | null> => {
    try {
      setLoading(true);
      setError(null);
      const getMeUseCase = container.get(GetMeUseCase);
      const user = await getMeUseCase.execute(token);
      return user;
    } catch (err: any) {
      setError(err?.message || "Error al obtener usuario");
      console.error("Error getting user:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getMe,
    loading,
    error,
  };
};
