import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const fetchUserProfile = async (userId) => {
  const { data } = await api.get(`/auth/${userId}`);
  return data;
};

export function useUserProfile(userId) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: Boolean(userId),
  });
}
