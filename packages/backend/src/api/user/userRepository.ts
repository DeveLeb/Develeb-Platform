//import bcrypt from 'bcrypt';

import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { user } from 'src/db/schema';
import { logger } from 'src/server';
import { UserResponse } from './userResponse';
import { User } from './userModel';
import { CreateUserRequest } from './userRequest/createUser';
export const userRepository = {
  findAllAsync: async (): Promise<UserResponse[]> => {
    return (await db.select().from(user)) as UserResponse[];
  },

  findByIdAsync: async (id: string): Promise<UserResponse | undefined> => {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0] as UserResponse | undefined;
  },
  findByEmailAsync: async (email: string): Promise<UserResponse | undefined> => {
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0] as UserResponse | undefined;
  },
  findByUsernameAsync: async (username: string): Promise<UserResponse | undefined> => {
    const result = await db.select().from(user).where(eq(user.username, username));
    return result[0] as UserResponse | undefined;
  },
  createUserAsync: async (
    email: string,
    username: string,
    password: string,
    fullName: string,
    phoneNumber: string,
    levelId: number,
    categoryId: number
  ): Promise<void> => {
    await db.insert(user).values({
      email,
      username,
      password,
      fullName,
      phoneNumber,
      levelId,
      categoryId,
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
    tags: string
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

