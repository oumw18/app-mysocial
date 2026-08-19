import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import "dotenv/config.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPass,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_SECRET,
      {
        expiresIn: process.env.ACCESS_EXPIRES,
      },
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        followers: true,
        following: true,
        likes: {
          include: {
            post: {
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
            },
          },
        },
        comments: {
          include: {
            post: {
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
            },
          },
        },
        posts: {
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
        },
      },
    });

    const formattedPosts = (user?.posts || []).map((post) => ({
      ...post,
      username: post.author?.username,
      followers: post.author?.followers,
      likeCount: post.likes?.length ?? 0,
      commentCount: post.comments?.length ?? 0,
    }));

    const commentedPosts = (user?.comments || [])
      .map((comment) => comment.post)
      .filter(Boolean)
      .filter((post, index, array) => {
        return array.findIndex((item) => item.id === post.id) === index;
      })
      .map((post) => ({
        ...post,
        username: post.author?.username,
        followers: post.author?.followers,
        likeCount: post.likes?.length ?? 0,
        commentCount: post.comments?.length ?? 0,
      }));

    const likedPosts = (user?.likes || [])
      .map((like) => like.post)
      .filter(Boolean)
      .filter((post, index, array) => {
        return array.findIndex((item) => item.id === post.id) === index;
      })
      .map((post) => ({
        ...post,
        username: post.author?.username,
        followers: post.author?.followers,
        likeCount: post.likes?.length ?? 0,
        commentCount: post.comments?.length ?? 0,
      }));

    const formattedUser = {
      ...user,
      posts: formattedPosts,
      commentedPosts,
      likedPosts,
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        followers: true,
        following: true,
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const posts = user.posts.map((post) => ({
      ...post,
      username: user.username,
      followers: user.followers,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));

    res.status(200).json({ ...user, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
