import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { toast } from "react-hot-toast";
import { updatePostsFollowers } from "../lib/postHelpers";

const createFollow = async (payload) => {
  const { data } = await api.post("/follows", payload);
  return data;
};

export function useCreateFollow({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFollow,
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        updatePostsFollowers(oldPosts, payload, "add", {
          followerId: payload.followerId,
          followingId: payload.followingId,
        }),
      );

      return { previousPosts };
    },
    onError: (error, _payload, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error(error.response?.data?.error || "Erreur lors du follow");
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["follows"]);
      onSuccess?.(data);
    },
  });
}

const deleteFollow = async (payload) => {
  const { data } = await api.delete("/follows", payload);
  return data;
};

export function useDeleteFollow({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFollow,
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        updatePostsFollowers(oldPosts, payload, "remove"),
      );

      return { previousPosts };
    },
    onError: (error, _payload, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error(error.response?.data?.error || "Erreur lors du unfollow");
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["follows"]);
      onSuccess?.(data);
    },
  });
}
