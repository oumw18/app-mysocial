import { Trash } from "lucide-react";
import { useState } from "react";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
} from "../hooks/useComment";
import { formatDate } from "../lib/formatDate";
import Loading from "../ux/Loading";

const Comment = ({ comment, userId, postId }) => {
  const deleteComment = useDeleteComment();

  const handleDeleteComment = () => {
    deleteComment.mutate({ commentId: comment.id, postId });
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 pt-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">
            {comment.username}
            {comment.authorId === userId && " (vous)"}
          </span>
          •
          <span className="text-xs text-gray-400">
            {formatDate(comment.date)}
          </span>
        </div>
        <p className="text-[0.95rem]">{comment.content}</p>
      </div>
      {comment.authorId === userId && (
        <div className="flex justify-end">
          <button
            className="btn btn-sm btn-soft btn-error"
            onClick={handleDeleteComment}
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default function CommentModal({ id, userId }) {
  const [content, setContent] = useState("");
  const { data: comments, isLoading, isError } = useComments(id);
  const commentList = Array.isArray(comments) ? comments : [];

  const createComment = useCreateComment({
    onSuccess: () => setContent(""),
  });

  const handleCreateComment = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    createComment.mutate({
      postId: id,
      authorId: userId,
      content: trimmedContent,
    });
  };

  if (isLoading) {
    return (
      <dialog className="modal" id={`modal-comment-${id}`}>
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Commentaire</h3>
          <Loading />
          <div className="modal-action">
            <button className="btn">close</button>
          </div>
        </form>
      </dialog>
    );
  }

  if (isError)
    return (
      <dialog className="modal h-dvh" id={`modal-comment-${id}`}>
        <form method="dialog" className="modal-box">
          <h3 className="text-center text-lg font-bold">Commentaire</h3>
          <p className="text-error p-8">Erreur serveur</p>
          <div className="modal-action">
            <button className="btn">close</button>
          </div>
        </form>
      </dialog>
    );

  return (
    <dialog className="modal h-dvh" id={`modal-comment-${id}`}>
      <form method="dialog" className="modal-box space-y-7 overflow-y-hidden">
        <h3 className="text-center text-lg font-bold">
          Commentaire({commentList.length})
        </h3>

        <div className="max-h-96 space-y-4 *:overflow-y-auto">
          {commentList.length ? (
            commentList.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                userId={userId}
                postId={id}
              />
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">
              Aucun commentaire
            </p>
          )}
        </div>

        <div>
          <textarea
            className="textarea w-full resize-none"
            placeholder="Commente..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCreateComment}
              disabled={createComment.isLoading || !content.trim()}
            >
              {createComment.isLoading ? "Publication..." : "Comment"}
            </button>
            <button className="btn">close</button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
