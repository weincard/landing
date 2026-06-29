import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/users";
import { useAuth } from "@/context/AuthContext";

type UpdateUserVars = {
  id: number;
  data: Partial<{
    name: string;
    lastname: string;
    email: string;
    document: string;
    documentType: string;
  }>;
};

export function useUpdateUser() {
  const { refreshUser } = useAuth();
  return useMutation({
    mutationFn: ({ id, data }: UpdateUserVars) => updateUser(id, data),
    onSuccess: () => refreshUser(),
  });
}
