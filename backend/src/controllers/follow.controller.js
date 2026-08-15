import prisma from "../config/db.js";

export const createFollow = async (req, res) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res
      .status(400)
      .json({ error: "followerId et followingId sont requis" });
  }

  if (followerId === followingId) {
    return res
      .status(400)
      .json({ error: "Vous ne pouvez pas vous suivre vous-même" });
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (existingFollow) {
      return res.status(409).json({ error: "Vous suivez déjà cette personne" });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(201).json({ message: "Follow créé avec succès", follow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFollow = async (req, res) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res
      .status(400)
      .json({ error: "followerId et followingId sont requis" });
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (!existingFollow) {
      return res.status(404).json({ error: "Ce follow n'existe pas" });
    }

    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    res.status(200).json({ message: "Follow supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  const { userId } = req.params;
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId }, // les gens qui suivent userId
    });
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  const { userId } = req.params;
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId }, // les gens que userId suit
    });
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
