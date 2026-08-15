import prisma from "../config/db.js";

export const createPost = async (req, res) => {
  const { authorId, content } = req.body;

  if (!authorId || !content) {
    return res.status(400).json({ error: "authorId and content are required" });
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await prisma.post.create({
      data: {
        authorId,
        content,
        image: imagePath,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            username: true,
            followers: true,
          },
        },
        likes: true,
        comments: true,
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      username: post.author.username,
      followers: post.author.followers,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: id,
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      likeCount: post.likes?.length ?? 0,
      commentCount: post.comments?.length ?? 0,
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: {
        id: id,
      },
    });

    res.json({ message: "Le post a été supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
