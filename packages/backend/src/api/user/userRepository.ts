//import bcrypt from 'bcrypt';

import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { user } from 'src/db/schema';

import { User } from '../user/userModel';
// export const users: User[] = [
//   {
//     id: '3',
//     fullname: 'Charlie',
//     email: 'charlie@example.com',
//     password: '654321',
//     tags: 'developer',
//     is_verified: true,
//     created_at: new Date(),
//     updated_at: new Date(),
//     role: 'user',
//     username: 'charlie321',
//     profile_url:
//       'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA',
//     category_id: 2,
//     level_id: 1,
//     phone_number: '+961 12345678',
//   },
//   {
//     id: '2',
//     fullname: 'Bob',
//     email: 'bob@example.com',
//     password: '1233456',
//     created_at: new Date(),
//     updated_at: new Date(),
//     role: 'admin',
//     username: 'bob123',
//     profile_url:
//       'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA',
//     is_verified: false,
//     category_id: 1,
//     level_id: 1,
//     phone_number: '+961 54738292',
//     tags: 'developer',
//   },
// ];

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