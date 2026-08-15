import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { toast } from "react-hot-toast";
import { updatePostsLikes } from "../lib/postHelpers";

// `updatePostsLikes` moved to ../lib/postHelpers

function updateMeLikes(user, payload, action, likeData) {
  if (!user || !Array.isArray(user.posts)) return user;

  return {
    ...user,
    posts: updatePostsLikes(user.posts, payload, action, likeData),
  };
}

const createLike = async (payload) => {
  const { data } = await api.post("/likes", payload);
  return data;
};

export function useCreateLike({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLike,
    onMutate: async (payload) => {
      await queryClient.cancelQueries(["posts"]);
      await queryClient.cancelQueries(["me"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousMe = queryClient.getQueryData(["me"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        updatePostsLikes(oldPosts, payload, "add", {
          id: `temp-${Date.now()}`,
          postId: payload.postId,
          userId: payload.userId,
        }),
      );

      queryClient.setQueryData(["me"], (oldMe) =>
        updateMeLikes(oldMe, payload, "add", {
          id: `temp-${Date.now()}`,
          postId: payload.postId,
          userId: payload.userId,
        }),
      );

      return { previousPosts, previousMe };
    },
    onError: (error, _payload, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousMe) {
        queryClient.setQueryData(["me"], context.previousMe);
      }
      toast.error(error.response?.data?.error || "Erreur lors du like");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Like ajouté");
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["me"]);
      onSuccess?.(data);
    },
  });
}

const deleteLike = async (likeId) => {
  const { data } = await api.delete(`/likes/${likeId}`);
  return data;
};

export function useDeleteLike({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLike,
    onMutate: async (likeId) => {
      await queryClient.cancelQueries(["posts"]);
      await queryClient.cancelQueries(["me"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousMe = queryClient.getQueryData(["me"]);
      const posts = previousPosts;

      const post = Array.isArray(posts)
        ? posts.find((item) =>
            Array.isArray(item.likes)
              ? item.likes.some((like) => like?.id === likeId)
              : false,
          )
        : undefined;

      queryClient.setQueryData(["posts"], (oldPosts) =>
        updatePostsLikes(
          oldPosts,
          {
            postId: post?.id,
            likeId,
          },
          "remove",
        ),
      );

      queryClient.setQueryData(["me"], (oldMe) =>
        updateMeLikes(
          oldMe,
          {
            postId: post?.id,
            likeId,
          },
          "remove",
        ),
      );

      return { previousPosts, previousMe };
    },
    onError: (error, _payload, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousMe) {
        queryClient.setQueryData(["me"], context.previousMe);
      }
      toast.error(error.response?.data?.error || "Erreur lors du unlike");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Like retiré");
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["me"]);
      onSuccess?.(data);
    },
  });
}

const fetchLikes = async (postId) => {
  const { data } = await api.get(`/likes/${postId}`);
  return data?.likes ?? data;
};

export function useLikes(postId) {
  return useQuery({
    queryKey: ["likes", postId],
    queryFn: () => fetchLikes(postId),
  });
}
