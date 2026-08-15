import app from "./app.js";
import dotenv from "dotenv";
import prisma from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected");
    app.listen(PORT, '0.0.0.0', () => {
      try {
        console.log(`Server run on: http://localhost:${PORT}`);
      } catch (error) {
        console.error("Error starting the server:", error);
      }
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

main();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
