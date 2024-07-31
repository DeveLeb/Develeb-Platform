export interface UserResponse {
  id: string;
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  levelId: number;
  categoryId: number;
  tags: string;
  updatedAt: Date;
}
