//import bcrypt from 'bcrypt';

import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { user } from 'src/db/schema';

import { User } from '../user/userModel';

export const userRepository = {
  findAllAsync: async () => {
    return await db.select().from(user);
  },

  findByIdAsync: async (id: string) => {
    return await db.select().from(user).where(eq(user.id, id));
  },
  findByEmailAsync: async (email: string) => {
    return await db.select().from(user).where(eq(user.email, email));
  },
  createUserAsync: async (
    email: string,
    username: string,
    password: string,
    fullName: string,
    phoneNumber: string,
    levelId: number,
    categoryId: number
  ) => {
    return await db.insert(user).values({
      email,
      username,
      password,
      fullName,
      phoneNumber,
      levelId,
      categoryId,
    });
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
