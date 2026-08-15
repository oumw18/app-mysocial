import { useMemo } from "react";
import { useCreateFollow, useDeleteFollow } from "../hooks/useFollow";
import { ChevronDown } from "lucide-react";

const FollowingBtn = ({ isFollowing, unFollow, isLoading }) => {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-outline btn-success btn-sm"
      >
        Suivi(e)
        {isFollowing && <ChevronDown size={15} />}
      </div>
      <ul
        tabIndex="0"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-32 p-2 shadow"
      >
        <li
          className="text-error text-2xl"
          onClick={(e) => {
            if (isLoading) return;
            unFollow(e);
          }}
        >
          <a disabled={isLoading}>Ne plus suivre</a>
        </li>
      </ul>
    </div>
  );
};

export default function FollowBtn({ followers = [], authorId, currentUserId }) {
  const createFollow = useCreateFollow();
  const deleteFollow = useDeleteFollow();

  const followerIds = useMemo(
    () =>
      Array.isArray(followers)
        ? followers.map((item) =>
            typeof item === "string"
              ? item
              : item?.followerId || item?.userId || item?.id || "",
          )
        : [],
    [followers],
  );

  const isFollowing = useMemo(
    () => followerIds.some((id) => String(id) === String(currentUserId)),
    [followerIds, currentUserId],
  );

  const handleFollow = () => {
    if (!currentUserId || !authorId) return;

    const payload = {
      followerId: currentUserId,
      followingId: authorId,
    };

    createFollow.mutate(payload);
  };

  const handleUnfollow = () => {
    if (!currentUserId || !authorId) return;

    const payload = {
      followerId: currentUserId,
      followingId: authorId,
    };

    deleteFollow.mutate(payload);
  };

  if (!currentUserId || authorId === currentUserId) return null;

  const isLoading = createFollow.isLoading || deleteFollow.isLoading;

  return (
    <>
      {isFollowing ? (
        <FollowingBtn
          isFollowing={isFollowing}
          unFollow={handleUnfollow}
          isLoading={isLoading}
        />
      ) : (
        <button
          type="button"
          className="btn btn-neutral btn-sm"
          onClick={handleFollow}
          disabled={isLoading}
        >
          Suivre
        </button>
      )}
    </>
  );
}
