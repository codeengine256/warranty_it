import prisma from '@/config/database';
import { CreateProductRequest, UpdateProductRequest, ProductWithUser, PaginationParams, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';
import logger from '@/config/logger';
import { Prisma } from '@prisma/client';

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
          status: 'ACTIVE',
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
        status,
        search,
      } = pagination;

      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = { userId };
      
      if (status) {
        if (status === 'EXPIRED') {
          // For expired, we need to check if endDate is in the past
          whereClause.endDate = { lt: new Date() };
        } else if (status === 'ACTIVE') {
          // For active, check if endDate is in the future
          whereClause.endDate = { gte: new Date() };
        } else {
          whereClause.status = status;
        }
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
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
        prisma.product.count({ where: whereClause }),
      ]);

      // Update product status based on current date
      const now = new Date();
      const updatedProducts = products.map((product: any) => {
        const isExpired = product.endDate < now;
        
        // Only update status if it's currently ACTIVE and has expired
        if (product.status === 'ACTIVE' && isExpired) {
          return {
            ...product,
            status: 'EXPIRED',
          };
        }
        
        return product;
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data: updatedProducts,
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

      // Update product status based on current date
      const now = new Date();
      const isExpired = product.endDate < now;
      
      // Only update status if it's currently ACTIVE and has expired
      if (product.status === 'ACTIVE' && isExpired) {
        return {
          ...product,
          status: 'EXPIRED',
        };
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
      // Get all products for the user
      const allProducts = await prisma.product.findMany({
        where: { userId },
        select: {
          id: true,
          status: true,
          endDate: true,
        },
      });

      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      // Calculate actual status based on current date
      let active = 0;
      let expired = 0;
      let claimed = 0;
      let cancelled = 0;
      let expiringSoon = 0;

      allProducts.forEach((product: any) => {
        const isExpired = product.endDate < now;
        
        if (product.status === 'CLAIMED') {
          claimed++;
        } else if (product.status === 'CANCELLED') {
          cancelled++;
        } else if (isExpired) {
          // Product has expired based on endDate, regardless of stored status
          expired++;
        } else {
          // Product is active (not expired)
          active++;
          
          // Check if expiring soon (within 30 days)
          if (product.endDate <= thirtyDaysFromNow) {
            expiringSoon++;
          }
        }
      });

      return {
        total: allProducts.length,
        active,
        expired,
        claimed,
        cancelled,
        expiringSoon,
      };
    } catch (error) {
      logger.error('Get product stats error:', error);
      throw error;
    }
  }
}
