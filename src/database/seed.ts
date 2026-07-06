import "reflect-metadata";
import { AppDataSource } from "@/database/data-source";
import { User, UserRole } from "@/entities/User";
import { hashPassword } from "@/lib/password";

async function seed() {
  try {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    const managerEmail =
      process.env.DEFAULT_MANAGER_EMAIL || "manager@example.com";

    const existedManager = await userRepository.findOne({
      where: { email: managerEmail },
    });

    if (existedManager) {
      console.log("Default manager already exists");
      return;
    }

    const passwordHash = await hashPassword(
      process.env.DEFAULT_MANAGER_PASSWORD || "123456",
    );

    const manager = userRepository.create({
      name: process.env.DEFAULT_MANAGER_NAME || "Default Manager",
      email: managerEmail,
      password: passwordHash,
      role: UserRole.MANAGER,
    });

    await userRepository.save(manager);

    console.log("Default manager created successfully");
    console.log({
      email: manager.email,
      password: process.env.DEFAULT_MANAGER_PASSWORD || "123456",
    });
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();
