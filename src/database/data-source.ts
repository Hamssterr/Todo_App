import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { UserSession } from "../entities/UserSession";

const isCli = process.argv[1]?.includes("typeorm");

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Task, UserSession],
  migrations: isCli ? ["src/database/migrations/*.ts"] : [],
  synchronize: false,
});

export async function getDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
}
