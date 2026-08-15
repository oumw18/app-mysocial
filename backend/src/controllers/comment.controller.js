import prisma from "../config/db.js";

export const createComment = async (req, res) => {
  const { postId, authorId, content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    const formattedComments = comments.map((comment) => ({
      ...comment,
      username: comment.author.username,
    }));

    res.status(200).json(formattedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: {
        id: id,
      },
    });
    res
      .status(201)
      .json({ message: "Le commentaire a été supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
