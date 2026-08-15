import Layout from "../components/Layout";
import Post from "../components/Post";
import { useAuth } from "../hooks/useAuth";
import Loading from "../ux/Loading";

export default function Profil() {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <p className="text-error p-8">Erreur serveur</p>;
      </Layout>
    );
  }

  const followingCount = user?.following?.length ?? 0;
  const followersCount = user?.followers?.length ?? 0;
  const posts = user?.posts || [];
  const commentedPosts = user?.commentedPosts || [];
  const likedPosts = user?.likedPosts || [];

  return (
    <Layout>
      <div className="space-y-4">
        <section className="space-y-3">
          <h1 className="text-2xl font-medium">Mon Profil</h1>
          <div className="flex gap-4">
            <div>
              <span className="font-semibold">{followersCount} </span> followers
            </div>
            <div>
              <span className="font-semibold">{followingCount} </span>
              followings
            </div>
          </div>
        </section>

        <section className="tabs tabs-border">
          <input
            type="radio"
            name="my_tabs_2"
            className="tab"
            aria-label="Posts"
            defaultChecked
          />
          <div className="tab-content space-y-4 p-10">
            {posts.length === 0 ? (
              <p>Aucun post</p>
            ) : (
              posts?.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post?.username ?? user?.username}
                  content={post?.content}
                  image={post?.image}
                  likeCount={post?.likeCount ?? post?.likes?.length ?? 0}
                  commentCount={
                    post?.commentCount ?? post?.comments?.length ?? 0
                  }
                  authorId={post?.authorId}
                  followers={post?.followers}
                  likes={post.likes}
                  createdAt={post.createdAt}
                />
              ))
            )}
          </div>
          {/* commentaires */}
          <input
            type="radio"
            name="my_tabs_2"
            className="tab"
            aria-label="Commentaires"
          />
          <div className="tab-content space-y-4 p-10">
            {commentedPosts.length === 0 ? (
              <p>Aucun post commenté</p>
            ) : (
              commentedPosts?.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post?.username ?? user?.username}
                  content={post?.content}
                  image={post?.image}
                  likeCount={post?.likeCount ?? post?.likes?.length ?? 0}
                  commentCount={
                    post?.commentCount ?? post?.comments?.length ?? 0
                  }
                  authorId={post?.authorId}
                  followers={post?.followers}
                  likes={post.likes}
                  createdAt={post.createdAt}
                />
              ))
            )}
          </div>
          {/* likes */}
          <input
            type="radio"
            name="my_tabs_2"
            className="tab"
            aria-label="Like"
          />
          <div className="tab-content space-y-4 p-10">
            {likedPosts.length === 0 ? (
              <p>Aucun post liké</p>
            ) : (
              likedPosts?.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post?.username ?? user?.username}
                  content={post?.content}
                  image={post?.image}
                  likeCount={post?.likeCount ?? post?.likes?.length ?? 0}
                  commentCount={
                    post?.commentCount ?? post?.comments?.length ?? 0
                  }
                  authorId={post?.authorId}
                  followers={post?.followers}
                  likes={post.likes}
                  createdAt={post.createdAt}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
