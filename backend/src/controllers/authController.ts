import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { RegisterRequest, LoginRequest, ApiResponse } from '@/types';
import logger from '@/config/logger';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterRequest = req.body;
      const result = await AuthService.register(data);

      const response: ApiResponse = {
        success: true,
        message: 'User registered successfully',
        data: result,
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error('Register controller error:', error);
      
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      const response: ApiResponse = {
        success: false,
        message,
        error: error.message,
      };

      res.status(statusCode).json(response);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginRequest = req.body;
      const result = await AuthService.login(data);

      const response: ApiResponse = {
        success: true,
        message: 'Login successful',
        data: result,
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Login controller error:', error);
      
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      const response: ApiResponse = {
        success: false,
        message,
        error: error.message,
      };

      res.status(statusCode).json(response);
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await AuthService.getProfile(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
      };

      res.json(response);
    } catch (error) {
      logger.error('Get profile controller error:', error);
      throw error;
    }
  }
}
