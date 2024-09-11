import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';
import passport from 'passport';
import { User } from '../userModel';
import { userRepository } from '../userRepository';
import { userService } from '../userService';
import { desc } from 'drizzle-orm';

vi.mock('../userRepository.ts');
vi.mock('../../../server', () => ({
  ...vi.importActual('../../../server'),
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('userService', () => {
  const mockUsers: User[] = [
    {
      id: 'a5003c65-8342-438c-ac9f-8051ba41f353',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      password: 'Password123!',
      username: 'johndoe',
      isVerified: true,
      categoryId: 1,
      levelId: 1,
      phoneNumber: '+96112345678',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      profileUrl: 'https://example.com/profile',
      tags: 'tag1,tag2',
    },
    {
      id: 'a5003c65-8342-438c-ac9f-8051ba41f354',
      fullName: 'John Doe',
      email: 'johndo@example.com',
      password: 'Password123!',
      username: 'johndo',
      isVerified: true,
      categoryId: 1,
      levelId: 1,
      phoneNumber: '+96112345676',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      profileUrl: 'https://example.com/profile',
      tags: 'tag1,tag2',
    },
  ];

  describe('findAll', () => {
    it('return all users', async () => {
      // Arrange
      (userRepository.findAllAsync as Mock).mockReturnValue(mockUsers);

      // Act
      const result = await userService.findAll(1, 10, undefined, undefined);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Users found');
      expect(result.responseObject).toEqual(mockUsers);
    });

    it('returns a not found error for no users found', async () => {
      // Arrange
      (userRepository.findAllAsync as Mock).mockReturnValue([]);

      // Act
      const result = await userService.findAll(1, 10, 'Jamy', undefined);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('No Users found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAllAsync', async () => {
      // Arrange
      (userRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await userService.findAll(1, 10, undefined, undefined);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding all users');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('findById', () => {
    it('returns a user for a valid ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      const mockUser = mockUsers.find((user) => user.id === testId);
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUser);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User found');
      expect(result.responseObject).toEqual(mockUser);
    });

    it('handles errors for findByIdAsync', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      (userRepository.findByIdAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error finding user with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f352';
      (userRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User not found');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('createUser', () => {
    it('creates a user', async () => {
      (userRepository.createUserAsync as Mock).mockReturnValue(null);
      const mockuser = {
        email: 'test@test.com',
        password: 'Gu1234568!',
        username: 'WKool',
        full_name: 'Wayne Jhonson',
        phone_number: '+96112345860',
        level_id: 1,
        category_id: 1,
      };
      const result = await userService.createUser(mockuser);

      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User created');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('deletes a user for a valid ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      (userRepository.deleteUserAsync as Mock).mockReturnValue(null);
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUsers.find((user) => user.id === testId));
      // Act
      const result = await userService.deleteUser(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NO_CONTENT);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User deleted');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for deleteUserAsync', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      (userRepository.deleteUserAsync as Mock).mockRejectedValue(new Error('Database error'));
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUsers.find((user) => user.id === testId));
      // Act
      const result = await userService.deleteUser(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error deleting user with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f3fk';
      (userRepository.deleteUserAsync as Mock).mockReturnValue(null);
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUsers.find((user) => user.id === testId));
      // Act
      const result = await userService.deleteUser(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User not found');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('updateUser', () => {
    it('updates a user for a valid ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      (userRepository.updateUserAsync as Mock).mockReturnValue(null);
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUsers.find((user) => user.id === testId));
      const fullname = 'Jhon Doe';
      const level_id = 1;
      const category_id = 1;
      const tags = 'tag1,tag2';
      // Act
      const result = await userService.updateUser(testId, fullname, level_id, category_id, tags);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User updated');
      expect(result.responseObject).toEqual(null);
    });

    it('handles errors for updateUserAsync', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      (userRepository.updateUserAsync as Mock).mockRejectedValue(new Error('Database error'));
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUsers.find((user) => user.id === testId));
      const fullname = 'Jhon Doe';
      const level_id = 1;
      const category_id = 1;
      const tags = 'tag1,tag2';
      // Act
      const result = await userService.updateUser(testId, fullname, level_id, category_id, tags);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error updating user with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41g392';
      (userRepository.updateUserAsync as Mock).mockReturnValue(null);
      (userRepository.findByIdAsync as Mock).mockReturnValue(mockUsers.find((user) => user.id === testId));
      const fullname = 'Jhon Doe';
      const level_id = 1;
      const category_id = 1;
      const tags = 'tag1,tag2';
      // Act
      const result = await userService.updateUser(testId, fullname, level_id, category_id, tags);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User not found');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('resetPassword', () => {
    it('resets the password for a valid user ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      const newPassword = 'NewPassword123!';
      const user = mockUsers.find((user) => user.id === testId);
      (userRepository.findByIdAsync as Mock).mockReturnValue(user);
      (userRepository.getPasswordAsync as Mock).mockReturnValue(user?.password);
      (userRepository.resetPasswordAsync as Mock).mockReturnValue(user);

      // Act
      const result = await userService.resetPassword(testId, newPassword);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Password reset');
      expect(result.responseObject).toEqual(mockUsers.find((user) => user.id === testId));
    });

    it('handles errors for resetPasswordAsync', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f353';
      const newPassword = 'NewPassword123!';
      const user = mockUsers.find((user) => user.id === testId);
      (userRepository.findByIdAsync as Mock).mockReturnValue(user);
      (userRepository.getPasswordAsync as Mock).mockReturnValue(user?.password);
      (userRepository.resetPasswordAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await userService.resetPassword(testId, newPassword);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error resetting password for user with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent user ID', async () => {
      // Arrange
      const testId = 'a5003c65-8342-438c-ac9f-8051ba41f3fk';
      const newPassword = 'NewPassword123!';
      (userRepository.resetPasswordAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userService.resetPassword(testId, newPassword);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User not found');
      expect(result.responseObject).toBeNull();
    });
  });
  describe('refreshToken')
  it('refreshes the token for a valid user ID', async () => {
    // Arrange
    const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFhNTIzODdhLWFjMDAtNGM3YS1hNDhlLTg2NjUyYzU0NzJkNiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyNjA2MzMwOSwiZXhwIjoxNzI2NjY4MTA5fQ.ju63GMbWXRs1R1Fws4Qdd5o4ss05HYzBbombg8TYaR4';
    (userRepository.findByIdAsync as Mock).mockReturnValue(user);

    // Act
    const result = await userService.userRefreshToken(refreshToken);

    // Assert
    expect(result.statusCode).toEqual(StatusCodes.OK);
    expect(result.success).toBeTruthy();
    expect(result.message).toContain('Token refreshed');
    expect(result.responseObject).toEqual(mockUsers.find((user) => user.id === testId));
  });
});
