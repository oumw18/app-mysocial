import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import toast from "react-hot-toast";
import { updatePostsComments } from "../lib/postHelpers";

const fetchComments = async (id) => {
  const { data } = await api.get(`/comments/${id}`);
  return data?.comments ?? data;
};

export function useComments(id) {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id),
  });
}

// `updatePostsComments` moved to ../lib/postHelpers

function updateMeComments(user, payload, action, commentData) {
  if (!user || !Array.isArray(user.posts)) return user;

  return {
    ...user,
    posts: updatePostsComments(user.posts, payload, action, commentData),
  };
}

const createComment = async (playload) => {
  const { data } = await api.post("/comments", playload);
  return data;
};

export function useCreateComment({ onSuccess } = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onMutate: async (playload) => {
      await queryClient.cancelQueries(["posts"]);
      await queryClient.cancelQueries(["me"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousMe = queryClient.getQueryData(["me"]);

      queryClient.setQueryData(["posts"], (oldPosts) =>
        updatePostsComments(oldPosts, playload, "add", {
          postId: playload.postId,
          authorId: playload.authorId,
          content: playload.content,
        }),
      );

      queryClient.setQueryData(["me"], (oldMe) =>
        updateMeComments(oldMe, playload, "add", {
          postId: playload.postId,
          authorId: playload.authorId,
          content: playload.content,
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
      toast.error(error.response?.data?.error || "Erreur lors du commentaire");
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["me"]);
      queryClient.invalidateQueries(["comments"]);
      onSuccess?.(data);
    },
  });
}

const deleteComment = async ({ commentId }) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

export function useDeleteComment({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["posts"]);
      await queryClient.cancelQueries(["me"]);
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousMe = queryClient.getQueryData(["me"]);
      const posts = previousPosts;

      const post = Array.isArray(posts)
        ? posts.find((item) =>
            Array.isArray(item.comments)
              ? item.comments.some((comment) => comment?.id === commentId)
              : false,
          )
        : undefined;

      queryClient.setQueryData(["posts"], (oldPosts) =>
        updatePostsComments(
          oldPosts,
          {
            postId: post?.id,
            commentId,
          },
          "remove",
        ),
      );

      queryClient.setQueryData(["me"], (oldMe) =>
        updateMeComments(
          oldMe,
          {
            postId: post?.id,
            commentId,
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
      toast.error(
        error.response?.data?.error ||
          "Erreur lors de la suppression du commentaire",
      );
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "Commentaire retiré");
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["me"]);
      if (variables?.postId) {
        queryClient.invalidateQueries(["comments", variables.postId]);
      } else {
        queryClient.invalidateQueries(["comments"]);
      }
      onSuccess?.(data);
    },
  });
}
