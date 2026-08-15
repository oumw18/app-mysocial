import Layout from "../components/Layout";
import Post from "../components/Post";
import { usePosts } from "../hooks/usePost";
import Loading from "../ux/Loading";

export default function Home() {
  const { data: posts, isLoading, isError } = usePosts();
  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (isError) return <p className="text-error p-8">Erreur serveur</p>;
  return (
    <Layout>
      <div className="flex h-full flex-col items-center justify-center gap-3">
        {posts?.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            username={post?.username}
            content={post?.content}
            image={post?.image}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            authorId={post?.authorId}
            followers={post?.followers}
            likes={post.likes}
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </Layout>
  );
}
