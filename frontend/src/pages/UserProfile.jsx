import { useParams } from "react-router";
import Layout from "../components/Layout";
import Post from "../components/Post";
import Loading from "../ux/Loading";
import { useUserProfile } from "../hooks/useUserProfile";
import FollowBtn from "../components/FollowBtn";
import { useAuth } from "../hooks/useAuth";

export default function UserProfile() {
  const { authorId } = useParams();
  const { data: currentUser } = useAuth();
  const { data: user, isLoading, isError } = useUserProfile(authorId);

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (isError || !user) {
    return (
      <Layout>
        <p className="text-error p-8">Utilisateur introuvable</p>
      </Layout>
    );
  }

  const followingCount = user?.following?.length ?? 0;
  const followersCount = user?.followers?.length ?? 0;
  const posts = user?.posts ?? [];

  return (
    <Layout>
      <div className="space-y-4">
        <section className="flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-medium">{user.username}</h1>
            <div className="flex gap-4">
              <div>
                <span className="font-semibold">{followersCount} </span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold">{followingCount} </span>
                followings
              </div>
            </div>
          </div>
          <FollowBtn
            authorId={authorId}
            followers={user?.followers}
            currentUserId={currentUser?.id}
          />
        </section>

        <section className="flex h-full flex-col items-center justify-center gap-3">
          {posts.length === 0 ? (
            <p>Aucun post</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                username={post.username ?? user.username}
                content={post.content}
                image={post.image}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                authorId={post.authorId}
                followers={post.followers ?? user.followers}
                likes={post.likes}
                createdAt={post.createdAt}
                showFollow={false}
              />
            ))
          )}
        </section>
      </div>
    </Layout>
  );
}
