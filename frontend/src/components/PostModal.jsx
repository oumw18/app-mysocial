import { useState } from "react";
import toast from "react-hot-toast";
import { useCreatePost } from "../hooks/usePost";
import { useAuth } from "../hooks/useAuth";

export default function PostModal() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const createPost = useCreatePost({
    onSuccess: () => {
      setContent("");
      setImageFile(null);
      document.getElementById("modal-post")?.close();
    },
  });

  const { data: me } = useAuth();

  const handleCreatePost = () => {
    if (!content.trim()) {
      toast.error("Le contenu du post est requis");
      return;
    }

    const formData = new FormData();
    formData.append("content", content.trim());
    if (me?.id) {
      formData.append("authorId", String(me.id));
    } else {
      toast.error("Utilisateur non connecté");
      return;
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    createPost.mutate(formData);
  };

  return (
    <dialog className="modal h-dvh" id="modal-post">
      <form method="dialog" className="modal-box space-y-7 overflow-y-hidden">
        <h3 className="text-center text-lg font-bold">Publie un post</h3>
        <div className="space-y-3">
          <textarea
            className="textarea w-full resize-none"
            placeholder="Écrire..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Ajoute une image</legend>
            <input
              type="file"
              accept=".jpeg, .png, .jpg, .webp"
              className="file-input w-full"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <label className="label">Optionnel</label>
          </fieldset>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCreatePost}
            disabled={createPost.isLoading || !content.trim()}
          >
            {createPost.isLoading ? "Publication..." : "Publie"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => document.getElementById("modal-post")?.close()}
          >
            Fermer
          </button>
        </div>
      </form>
    </dialog>
  );
}
