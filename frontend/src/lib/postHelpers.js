function formatPostBase(post) {
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];

  return {
    ...post,
    username: post.author?.username ?? post.username,
    followers: post.author?.followers ?? post.followers,
    likeCount:
      typeof post.likeCount === "number" ? post.likeCount : likes.length,
    commentCount:
      typeof post.commentCount === "number"
        ? post.commentCount
        : comments.length,
  };
}

export function updatePostsComments(posts, payload, action, commentData) {
  if (!Array.isArray(posts)) return posts;

  return posts.map((post) => {
    if (post.id !== payload.postId) return post;

    const comments = Array.isArray(post.comments) ? post.comments : [];
    const base = formatPostBase(post);

    if (action === "add" && commentData) {
      return {
        ...base,
        comments: [...comments, commentData],
        commentCount:
          typeof base.commentCount === "number"
            ? base.commentCount + 1
            : comments.length + 1,
      };
    }

    if (action === "remove") {
      const newcomments = comments.filter(
        (item) => item?.id !== payload.commentId,
      );
      return {
        ...base,
        comments: newcomments,
        commentCount:
          typeof base.commentCount === "number"
            ? Math.max(0, base.commentCount - 1)
            : newcomments.length,
      };
    }

    return base;
  });
}

export function updatePostsLikes(posts, payload, action, likeData) {
  if (!Array.isArray(posts)) return posts;

  return posts.map((post) => {
    if (post.id !== payload.postId) return post;

    const likes = Array.isArray(post.likes) ? post.likes : [];
    const base = formatPostBase(post);

    if (action === "add" && likeData) {
      return {
        ...base,
        likes: [...likes, likeData],
        likeCount:
          typeof base.likeCount === "number"
            ? base.likeCount + 1
            : likes.length + 1,
      };
    }

    if (action === "remove") {
      const newLikes = likes.filter((item) => item?.id !== payload.likeId);
      return {
        ...base,
        likes: newLikes,
        likeCount:
          typeof base.likeCount === "number"
            ? Math.max(0, base.likeCount - 1)
            : newLikes.length,
      };
    }

    return base;
  });
}

export function updatePostsFollowers(posts, payload, action, followData) {
  if (!Array.isArray(posts)) return posts;

  return posts.map((post) => {
    // authorId is used by follow logic (posts author)
    if (post.authorId !== payload.followingId) return post;

    const followers = Array.isArray(post.followers) ? post.followers : [];
    const base = formatPostBase(post);

    if (action === "add" && followData) {
      return {
        ...base,
        followers: [...followers, followData],
      };
    }

    if (action === "remove") {
      return {
        ...base,
        followers: followers.filter(
          (item) => item?.followerId !== payload.followerId,
        ),
      };
    }

    return base;
  });
}
