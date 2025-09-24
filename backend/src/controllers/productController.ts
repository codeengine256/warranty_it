import { Request, Response } from 'express';
import { ProductService } from '@/services/productService';
import { CreateProductRequest, UpdateProductRequest, ApiResponse, PaginationParams } from '@/types';
import logger from '@/config/logger';

export class ProductController {
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const data: CreateProductRequest = req.body;
      
      const product = await ProductService.createProduct(userId, data);

      const response: ApiResponse = {
        success: true,
        message: 'Product created successfully',
        data: product,
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error('Create product controller error:', error);
      
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

  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        status: req.query.status as string,
        search: req.query.search as string,
      };

      const result = await ProductService.getProducts(userId, pagination);

      const response: ApiResponse = {
        success: true,
        message: 'Products retrieved successfully',
        data: result,
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Get products controller error:', error);
      
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

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const product = await ProductService.getProductById(id, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Get product by ID controller error:', error);
      
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

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const data: UpdateProductRequest = req.body;

      const product = await ProductService.updateProduct(id, userId, data);

      const response: ApiResponse = {
        success: true,
        message: 'Product updated successfully',
        data: product,
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Update product controller error:', error);
      
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

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      await ProductService.deleteProduct(id, userId);

      const response: ApiResponse = {
        success: true,
        message: 'Product deleted successfully',
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Delete product controller error:', error);
      
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

  static async getProductStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const stats = await ProductService.getProductStats(userId);

      const response: ApiResponse = {
        success: true,
        message: 'Product statistics retrieved successfully',
        data: stats,
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Get product stats controller error:', error);
      
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
}
