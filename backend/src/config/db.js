import { PrismaClient } from "../../generated/prisma/client.ts";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export default prisma;
