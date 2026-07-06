import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";
import type { Task } from "./Task";
import type { UserSession } from "./UserSession";

export enum UserRole {
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, select: false })
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role!: UserRole;

  /**
   * Các task mà user này được giao.
   * Ví dụ: employee được manager assign task.
   */
  @OneToMany("Task", (task: Task) => task.assignedTo)
  assignedTasks!: Relation<Task>[];

  /**
   * Các task mà user này tạo.
   * Ví dụ: manager tạo task cho employee.
   */
  @OneToMany("Task", (task: Task) => task.createdBy)
  createdTasks!: Relation<Task>[];

  /**
   * Các refresh token session của user.
   */
  @OneToMany("UserSession", (session: UserSession) => session.user)
  sessions!: Relation<UserSession>[];

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
