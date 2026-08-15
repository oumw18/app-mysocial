import { MessageCircle, Trash } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import FollowBtn from "./FollowBtn";
import LikeBtn from "./LikeBtn";
import CommentModal from "./CommentModal";
import LikeModal from "./LikeModal";
import { formatDate } from "../lib/formatDate";
import { useDeletePost } from "../hooks/usePost";

export default function Post({
  id,
  username,
  content,
  image,
  likeCount,
  commentCount,
  authorId,
  followers,
  likes,
  createdAt,
}) {
  const normalizedLikeCount =
    typeof likeCount === "number" ? likeCount : (likes?.length ?? 0);
  const normalizedCommentCount =
    typeof commentCount === "number" ? commentCount : 0;
  const { data: user } = useAuth();

  const openCommentModal = (id) => {
    document.getElementById(`modal-comment-${id}`)?.showModal();
  };

  const openLikeModal = (id) => {
    document.getElementById(`modal-like-${id}`)?.showModal();
  };

  const deletePost = useDeletePost();

  const handleDelete = (postId) => {
    if (!confirm("Voulez-vous supprimer votre post")) return;
    deletePost.mutate(postId);
  };

  // const { userId } = useParams();

  return (
    <div className="card bg-base-200 w-full shadow-sm md:w-3xl">
      <div className="card-body">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            {user?.id === authorId ? (
              <h2 className="card-title">{username}</h2>
            ) : (
              <a href={`/user-profile/${authorId}`} className="card-title hover:text-accent">
                {username}
              </a>
            )}
            •<span>{formatDate(createdAt)}</span>
          </div>
          <FollowBtn
            followers={followers}
            authorId={authorId}
            currentUserId={user?.id}
          />
          {user?.id === authorId && (
            <button
              className="btn btn-sm btn-error btn-outline"
              onClick={() => handleDelete(id)}
            >
              <Trash size={15} />
            </button>
          )}
        </div>
        {content && <p>{content}</p>}

        <figure>
          {image && (
            <img
              src={`http://localhost:3000/api/${image}`}
              alt="image post"
              className="rounded-md"
            />
          )}
        </figure>
        {/* Likes et Commentaires */}
        <div className="card-actions items-center justify-end gap-4 font-medium">
          <div className="flex cursor-pointer items-center gap-1">
            <LikeBtn likes={likes} currentUserId={user?.id} postId={id} />
            <span className="hover:link" onClick={() => openLikeModal(id)}>
              {normalizedLikeCount}
            </span>
          </div>
          <div
            type="button"
            onClick={() => openCommentModal(id)}
            className="flex cursor-pointer items-center gap-1"
          >
            <MessageCircle size={16} />
            {normalizedCommentCount}
          </div>
        </div>
      </div>
      <CommentModal id={id} userId={user?.id} />
      <LikeModal id={id} userId={user?.id} />
    </div>
  );
}
