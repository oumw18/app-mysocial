import { useLikes } from "../hooks/useLike";
import Loading from "../ux/Loading";

export default function LikeModal({ id, userId }) {
  const { data: likes, isLoading, isError } = useLikes(id);
  const likeList = Array.isArray(likes) ? likes : [];

  if (isLoading) {
    return (
      <dialog className="modal" id={`modal-like-${id}`}>
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Mention J'aime</h3>
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
      <dialog className="modal h-dvh" id={`modal-like-${id}`}>
        <form method="dialog" className="modal-box">
          <h3 className="text-center text-lg font-bold">Mention J'aime</h3>
          <p className="text-error p-8">Erreur serveur</p>
          <div className="modal-action">
            <button className="btn">close</button>
          </div>
        </form>
      </dialog>
    );

  return (
    <dialog className="modal h-dvh" id={`modal-like-${id}`}>
      <form
        method="dialog"
        className="modal-box w-75 space-y-7 overflow-y-hidden"
      >
        <h3 className="text-center text-lg font-bold">
          Mention J'aime({likeList.length})
        </h3>

        <div className="max-h-96 space-y-4 *:overflow-y-auto">
          {likeList.length ? (
            likeList.map((like) => (
              <div key={like.id}>
                <p className="font-medium">
                  {like.user.username}
                  {like.user.id === userId && " (vous)"}
                  ❤️
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">
              Aucun mention J'aime
            </p>
          )}
        </div>

        <div className="modal-action">
          <button className="btn">close</button>
        </div>
      </form>
    </dialog>
  );
}
