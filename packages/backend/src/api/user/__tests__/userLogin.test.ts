import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { describe, expect, it, vi } from 'vitest';

import { userService } from '../userService';

describe('userService.userLogin', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log in a user successfully', async () => {
    // Mock passport.authenticate
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
      return (req: Request, res: Response, next: NextFunction) => {
        req.user = { email: 'kek@hotmail.com', password: 'testUser' }; // Mock user
        next();
      };
    });

     // Mock req.login
     mockRequest.login = vi.fn((user, options, callback) => {
      // Simulate successful login
      const err = null;
      const token = 'mockToken';
      const refreshToken = 'mockRefreshToken';

      if (callback) {
        callback(err);
      }

      // Optionally mock ServiceResponse if needed
      // Example: return a promise to match async/await
      return new Promise((resolve) => {
        resolve({
          token,
          refreshToken,
        });
      });
    });

    // Call the userService method
    await userService.userLogin(mockRequest, mockResponse, next);

    // Call the userService method
    await userService.userLogin(mockRequest, mockResponse, next);

    // Assertions
    expect(passport.authenticate).toHaveBeenCalled();
    expect(mockRequest.login).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Login successful' });
  });

  it('should handle login error', async () => {
    // Mock passport.authenticate to simulate an error
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
      return (req: Request, res: Response, next: NextFunction) => {
        next(new Error('Authentication failed'));
      };
    });

    await userService.userLogin(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalledWith(new Error('Authentication failed'));
  });
});
