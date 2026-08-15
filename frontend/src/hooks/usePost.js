import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import toast from "react-hot-toast";

const fetchPosts = async () => {
  const { data } = await api.get("/posts");
  return data;
};

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
}

const createPost = async (formData) => {
  const { data } = await api.post("/posts", formData);
  return data;
};

export function useCreatePost({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onMutate: async () => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      return { previousPosts };
    },
    onError: (error, _payload, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error(
        error.response?.data?.error || "Erreur lors de la création du post",
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Post créé");
      queryClient.invalidateQueries(["posts"]);
      onSuccess?.(data);
    },
  });
}

const deletePost = async (postId) => {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
};

export function useDeletePost({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onMutate: async () => {
      await queryClient.cancelQueries(["posts"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      return { previousPosts };
    },
    onError: (error, _payload, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error(
        error.response?.data?.error || "Erreur lors de la suppression du post",
      );
    },
    onSuccess: (data) => {
      toast.success(data.message || "Post supprimé");
      queryClient.invalidateQueries(["posts"]);
      onSuccess?.(data);
    },
  });
}

