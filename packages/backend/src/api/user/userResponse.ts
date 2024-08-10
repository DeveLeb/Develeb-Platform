import { Roles } from 'src/common/middleware/authConfig/roles';
export interface UserResponse {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Roles;
  fullName: string;
  phoneNumber: string;
  levelId: number;
  categoryId: number;
  tags: string;
  updatedAt: Date;
}
