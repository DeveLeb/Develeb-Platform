//import bcrypt from 'bcrypt';

import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { user } from 'src/db/schema';
import { logger } from 'src/server';

import { User } from './userModel';
import { CreateUserRequest } from './userRequest/createUser';
export const userRepository = {
  findAllAsync: async () => {
    return await db.select().from(user);
  },

  findByIdAsync: async (id: string) => {
    return await db.select().from(user).where(eq(user.id, id));
  },
  findByUsernameAsync: async (username: string): Promise<User | undefined> => {
    try{
      const result = await db.select().from(user).where(eq(user.username, username));
      return result[0] as User | undefined;
    } catch (err) {
      logger.error(err);
    }
  },
  findByEmailAsync: async (email: string): Promise<User | undefined> => {
    try {
      const result = await db.select().from(user).where(eq(user.email, email));
      return result[0] as User | undefined;
    } catch (err) {
      logger.error(err);
    }
  },
  createUserAsync: async (createUserRequest: CreateUserRequest): Promise<void> => {
    try {
      await db.insert(user).values({
        email: createUserRequest.email,
        username: createUserRequest.username,
        password: createUserRequest.password,
        fullName: createUserRequest.full_name,
        phoneNumber: createUserRequest.phone_number,
        levelId: createUserRequest.level_id,
        categoryId: createUserRequest.category_id,
      });
    } catch (err) {
      logger.error(err);
    }
  },
  deleteUserAsync: async (id: string) => {
    console.log('id: ', id);
    return await db.delete(user).where(eq(user.id, id));
  },
  updateUserAsync: async (id: string, fullName: string, levelId: number, categoryId: number, tags: string) => {
    const updatedAt = new Date();
    return await db
      .update(user)
      .set({ fullName, levelId, categoryId, tags, updatedAt })
      .where(eq(user.id, id))
      .returning();
  },
};
