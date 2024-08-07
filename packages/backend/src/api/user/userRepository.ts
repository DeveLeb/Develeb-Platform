import { and, eq, like, or } from 'drizzle-orm';
import { db } from 'src/db';
import { user } from 'src/db/schema';

import { CreateUserRequest } from './userRequest';
import { UserResponse } from './userResponse';
export const userRepository = {
  findAllAsync: async (
    pageIndex: number,
    pageSize: number,
    username?: string,
    email?: string
  ): Promise<UserResponse[]> => {
    const offset = (pageIndex - 1) * pageSize;

    const filters = [];
    if (username) {
      filters.push(like(user.username, `%${username}%`));
    }
    if (email) {
      filters.push(like(user.email, `%${email}%`));
    }
    const query = db
      .select()
      .from(user)
      .limit(pageSize)
      .offset(offset)
      .where(and(...filters));

    return (await query) as UserResponse[];
  },

  findByIdAsync: async (id: string): Promise<UserResponse | undefined> => {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0] as UserResponse | undefined;
  },
  findByEmailAsync: async (email: string): Promise<UserResponse | undefined> => {
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0] as UserResponse | undefined;
  },
  findByUsernameOrEmailAsync: async (username: string, email: string): Promise<UserResponse | undefined> => {
    const result = await db
      .select()
      .from(user)
      .where(or(eq(user.username, username), eq(user.email, email)));
    return result[0] as UserResponse | undefined;
  },
  createUserAsync: async (createUserRequest: CreateUserRequest): Promise<void> => {
    await db.insert(user).values({
      email: createUserRequest.email,
      username: createUserRequest.username,
      password: createUserRequest.password,
      fullName: createUserRequest.full_name,
      phoneNumber: createUserRequest.phone_number,
      levelId: createUserRequest.level_id,
    });
  },
  deleteUserAsync: async (id: string): Promise<void> => {
    await db.delete(user).where(eq(user.id, id));
  },
  updateUserAsync: async (
    id: string,
    fullName: string,
    levelId: number,
    categoryId: number,
    tags: string | undefined
  ): Promise<UserResponse | undefined> => {
    const updatedAt = new Date();
    const result = await db
      .update(user)
      .set({ fullName, levelId, categoryId, tags, updatedAt })
      .where(eq(user.id, id))
      .returning();

    return result[0] as UserResponse | undefined;
  },
};
