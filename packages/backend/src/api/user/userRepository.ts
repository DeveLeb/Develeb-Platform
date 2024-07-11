import { User } from '../user/userModel';
import bcrypt from 'bcrypt';
// const hashPassword = async (password: string) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };
export const users: User[] = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    age: 42,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user',
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    age: 21,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'admin',
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
};
