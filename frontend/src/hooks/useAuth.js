import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useAuth = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/auth/me");
        return data;
      } catch (e) {
        localStorage.removeItem("token");
        throw e;
      }
    },
  });
};
