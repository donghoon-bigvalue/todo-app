import type { User, UserId } from "./user";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByLoginId(loginId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  updatePasswordHash(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
