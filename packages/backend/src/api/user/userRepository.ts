//import bcrypt from 'bcrypt';

import { User } from '../user/userModel';
// const hashPassword = async (password: string) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };
export const users: User[] = [
  {
    id: '3',
    fullname: 'Charlie',
    email: 'charlie@example.com',
    password: '654321',
    tags: 'developer',
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
    role: 'user',
    username: 'charlie321',
    profile_url:
      'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA',
    category_id: 2,
    level_id: 1,
    phone_number: '+961 12345678',
  },
  {
    id: '2',
    fullname: 'Bob',
    email: 'bob@example.com',
    password: '1233456',
    created_at: new Date(),
    updated_at: new Date(),
    role: 'admin',
    username: 'bob123',
    profile_url:
      'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA',
    is_verified: false,
    category_id: 1,
    level_id: 1,
    phone_number: '+961 54738292',
    tags: 'developer',
  },
];

export const userRepository = {
  findAllAsync: async (): Promise<User[]> => {
    return users;
  },

  findByIdAsync: async (id: string): Promise<User | null> => {
    return users.find((user) => user.id === id) || null;
  },
  findByEmailAsync: async (email: string): Promise<User | null> => {
    return users.find((user) => user.email === email) || null;
  },
  createUserAsync: async (
    email: string,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    level_id: number,
    category_id: number
  ): Promise<User> => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      fullname: `${first_name} ${last_name}`,
      email,
      phone_number: phone_number,
      created_at: new Date(),
      updated_at: new Date(),
      role: 'user',
      password: password,
      username,
      profile_url: '',
      is_verified: false,
      category_id: category_id,
      level_id: level_id,
      tags: '',
    };
    users.push(newUser); // replace this with the orm fnctn
    return newUser;
  },
  deleteUserAsync: async (user: User): Promise<User> => {
    users.splice(users.indexOf(user), 1);
    return user;
  },
  updateUserAsync: async (
    user: User,
    full_name: string,
    level_id: number,
    category_id: number,
    tags: string
  ): Promise<User> => {
    const existingUser = users.find((u) => u.id === user.id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    existingUser.fullname = full_name;
    existingUser.level_id = level_id;
    existingUser.category_id = category_id;
    existingUser.tags = tags;
    existingUser.updated_at = new Date();

    return existingUser;
  },
};
