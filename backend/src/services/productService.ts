import prisma from '@/config/database';
import { CreateProductRequest, UpdateProductRequest, ProductWithUser, PaginationParams, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';
import logger from '@/config/logger';
import { ProductStatus } from '@prisma/client';

export class ProductService {
  static async createProduct(userId: string, data: CreateProductRequest) {
    try {
      // Calculate end date based on warranty period
      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + data.warrantyPeriod);

      // Check if serial number already exists
      if (data.serialNumber) {
        const existingProduct = await prisma.product.findUnique({
          where: { serialNumber: data.serialNumber },
        });

        if (existingProduct) {
          throw new AppError('Product with this serial number already exists', 400);
        }
      }

      const product = await prisma.product.create({
        data: {
          name: data.name,
          brand: data.brand,
          type: data.type,
          warrantyPeriod: data.warrantyPeriod,
          startDate,
          endDate,
          description: data.description,
          serialNumber: data.serialNumber,
          purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : null,
          status: ProductStatus.ACTIVE,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info('Product created successfully', { productId: product.id, userId });

      return product;
    } catch (error) {
      logger.error('Create product error:', error);
      throw error;
    }
  }

  static async getProducts(
    userId: string,
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<ProductWithUser>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = pagination;

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: { userId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.product.count({ where: { userId } }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Get products error:', error);
      throw error;
    }
  }

  static async getProductById(productId: string, userId: string): Promise<ProductWithUser> {
    try {
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      return product;
    } catch (error) {
      logger.error('Get product by ID error:', error);
      throw error;
    }
  }

  static async updateProduct(
    productId: string,
    userId: string,
    data: UpdateProductRequest
  ): Promise<ProductWithUser> {
    try {
      // Check if product exists and belongs to user
      const existingProduct = await prisma.product.findFirst({
        where: {
          id: productId,
          userId,
        },
      });

      if (!existingProduct) {
        throw new AppError('Product not found', 404);
      }

      // Check serial number uniqueness if being updated
      if (data.serialNumber && data.serialNumber !== existingProduct.serialNumber) {
        const duplicateProduct = await prisma.product.findUnique({
          where: { serialNumber: data.serialNumber },
        });

        if (duplicateProduct) {
          throw new AppError('Product with this serial number already exists', 400);
        }
      }

      // Calculate new end date if warranty period or start date is being updated
      let updateData: any = { ...data };
      
      if (data.warrantyPeriod || data.startDate) {
        const newStartDate = data.startDate ? new Date(data.startDate) : existingProduct.startDate;
        const newWarrantyPeriod = data.warrantyPeriod || existingProduct.warrantyPeriod;
        const newEndDate = new Date(newStartDate);
        newEndDate.setMonth(newEndDate.getMonth() + newWarrantyPeriod);
        
        updateData.startDate = newStartDate;
        updateData.endDate = newEndDate;
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info('Product updated successfully', { productId, userId });

      return product;
    } catch (error) {
      logger.error('Update product error:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: string, userId: string): Promise<void> {
    try {
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          userId,
        },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      await prisma.product.delete({
        where: { id: productId },
      });

      logger.info('Product deleted successfully', { productId, userId });
    } catch (error) {
      logger.error('Delete product error:', error);
      throw error;
    }
  }

  static async getProductStats(userId: string) {
    try {
      const [
        totalProducts,
        activeProducts,
        expiredProducts,
        claimedProducts,
        cancelledProducts,
      ] = await Promise.all([
        prisma.product.count({ where: { userId } }),
        prisma.product.count({ where: { userId, status: ProductStatus.ACTIVE } }),
        prisma.product.count({ where: { userId, status: ProductStatus.EXPIRED } }),
        prisma.product.count({ where: { userId, status: ProductStatus.CLAIMED } }),
        prisma.product.count({ where: { userId, status: ProductStatus.CANCELLED } }),
      ]);

      // Get products expiring in the next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringSoon = await prisma.product.count({
        where: {
          userId,
          status: ProductStatus.ACTIVE,
          endDate: {
            lte: thirtyDaysFromNow,
            gte: new Date(),
          },
        },
      });

      return {
        total: totalProducts,
        active: activeProducts,
        expired: expiredProducts,
        claimed: claimedProducts,
        cancelled: cancelledProducts,
        expiringSoon,
      };
    } catch (error) {
      logger.error('Get product stats error:', error);
      throw error;
    }
  }
}
