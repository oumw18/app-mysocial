import { useMemo } from "react";
import { Heart } from "lucide-react";
import { useCreateLike, useDeleteLike } from "../hooks/useLike";

export default function LikeBtn({ likes = [], currentUserId, postId }) {
  const createLike = useCreateLike();
  const deleteLike = useDeleteLike();

  const currentLike = useMemo(
    () =>
      Array.isArray(likes)
        ? likes.find(
            (item) =>
              item === currentUserId || item?.userId === currentUserId,
          )
        : undefined,
    [likes, currentUserId],
  );

  const isLiked = Boolean(currentLike);
  const isLoading = createLike.isLoading || deleteLike.isLoading;

  const handleToggleLike = () => {
    if (!currentUserId || !postId) return;

    if (isLiked) {
      const likeId = currentLike?.id;
      if (!likeId) return;
      deleteLike.mutate(likeId);
      return;
    }

    createLike.mutate({ postId, userId: currentUserId });
  };

  return (
    <button
      type="button"
      className={isLiked ? "text-red-500" : ""}
      aria-label={isLiked ? "Retirer le like" : "Ajouter un like"}
      onClick={handleToggleLike}
      disabled={isLoading || !currentUserId}
    >
      <Heart fill={isLiked ? "currentColor" : "none"}  size={16}/>
    </button>
  );
  
}
