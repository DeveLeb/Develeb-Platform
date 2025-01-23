import { Roles } from 'src/common/middleware/authConfig/roles';

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  password: string;
  fullName: string;
  role: Roles;
  phoneNumber: string;
  levelId: number;
  categoryId: number;
  tags: string;
  updatedAt: Date;
}
