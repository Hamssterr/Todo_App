import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  type Relation,
} from "typeorm";
import type { User } from "./User";

@Entity("user_sessions")
export class UserSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /**
   * Foreign key: userId
   */
  @Index()
  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne("User", (user: User) => user.sessions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;

  /**
   * Không lưu refresh token plain text.
   * Chỉ lưu hash của refresh token.
   */
  @Column({ type: "varchar", length: 255 })
  refreshTokenHash!: string;

  @Column({ type: "timestamptz" })
  expiresAt!: Date;

  @Column({ type: "timestamptz", nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
