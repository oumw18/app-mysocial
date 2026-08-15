import prisma from "../config/db.js";

export const LikePost = async (req, res) => {
  const { postId, userId } = req.body;

  try {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    res.status(201).json({ message: "Le post a été liké avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const UnlikePost = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.like.delete({
      where: {
        id: id,
      },
    });
    res.status(201).json({ message: "Le post a été disliké avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikesByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const likes = await prisma.like.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    const formattedLikes = likes.map((like) => ({
      ...like,
      username: like.user.username,
    }));
    res.status(200).json(formattedLikes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
