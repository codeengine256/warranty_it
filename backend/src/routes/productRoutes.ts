import { Router } from 'express';
import { ProductController } from '@/controllers/productController';
import {
  createProductValidation,
  updateProductValidation,
  getProductValidation,
  getProductsValidation,
} from '@/validators/productValidators';
import { validate } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// All product routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - type
 *               - warrantyPeriod
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: MacBook Pro 16"
 *               brand:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Apple
 *               type:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Laptop
 *               warrantyPeriod:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 example: 12
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-15"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: High-performance laptop for professional use
 *               serialNumber:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: MBP16-2023-001
 *               purchasePrice:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0
 *                 example: 2499.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or duplicate serial number
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/', validate(createProductValidation), ProductController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get paginated list of user's products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, brand, type, warrantyPeriod, startDate, endDate, createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', validate(getProductsValidation), ProductController.getProducts);

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Get product statistics for the user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ProductStats'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/stats', ProductController.getProductStats);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/:id', validate(getProductValidation), ProductController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: MacBook Pro 16" (Updated)
 *               brand:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Apple
 *               type:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Laptop
 *               warrantyPeriod:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 example: 24
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-15"
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Updated description
 *               serialNumber:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: MBP16-2023-001-UPDATED
 *               purchasePrice:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0
 *                 example: 2599.99
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, EXPIRED, CLAIMED, CANCELLED]
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or duplicate serial number
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
router.put('/:id', validate(updateProductValidation), ProductController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', validate(getProductValidation), ProductController.deleteProduct);

export default router;
