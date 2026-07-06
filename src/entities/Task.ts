import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  type Relation,
} from "typeorm";
import { User } from "./User";

import { TaskStatus, TaskPriority } from "@/types/task.type";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status!: TaskStatus;

  @Column({
    type: "enum",
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @Column({ type: "timestamptz", nullable: true })
  dueDate!: Date | null;

  /**
   * Foreign key: assignedToId
   * User được giao task.
   */
  @Index()
  @Column({ type: "uuid" })
  assignedToId!: string;

  @ManyToOne(() => User, (user: User) => user.assignedTasks, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "assignedToId" })
  assignedTo!: Relation<User>;

  /**
   * Foreign key: createdById
   * User tạo task.
   */
  @Index()
  @Column({ type: "uuid" })
  createdById!: string;

  @ManyToOne(() => User, (user: User) => user.createdTasks, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "createdById" })
  createdBy!: Relation<User>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  /**
   * Soft delete.
   * Khi dùng repository.softDelete() hoặc softRemove(),
   * field này sẽ được set thời gian xóa.
   */
  @DeleteDateColumn({ type: "timestamptz", nullable: true })
  deletedAt!: Date | null;
}
