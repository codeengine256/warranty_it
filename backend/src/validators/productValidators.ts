import { body, param, query } from 'express-validator';

export const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),

  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand must be between 2 and 50 characters'),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Product type is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Product type must be between 2 and 50 characters'),

  body('warrantyPeriod')
    .isInt({ min: 1, max: 120 })
    .withMessage('Warranty period must be between 1 and 120 months'),

  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      
      if (date > now) {
        throw new Error('Start date cannot be in the future');
      }
      
      if (date < oneYearAgo) {
        throw new Error('Start date cannot be more than one year ago');
      }
      
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('serialNumber')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Serial number must be between 3 and 50 characters'),

  body('purchasePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Purchase price must be a positive number'),
];

export const updateProductValidation = [
  param('id')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Invalid product ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),

  body('brand')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand must be between 2 and 50 characters'),

  body('type')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Product type must be between 2 and 50 characters'),

  body('warrantyPeriod')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Warranty period must be between 1 and 120 months'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value) => {
      if (!value) return true;
      
      const date = new Date(value);
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      
      if (date > now) {
        throw new Error('Start date cannot be in the future');
      }
      
      if (date < oneYearAgo) {
        throw new Error('Start date cannot be more than one year ago');
      }
      
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('serialNumber')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Serial number must be between 3 and 50 characters'),

  body('purchasePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Purchase price must be a positive number'),

  body('status')
    .optional()
    .isIn(['ACTIVE', 'EXPIRED', 'CLAIMED', 'CANCELLED'])
    .withMessage('Status must be one of: ACTIVE, EXPIRED, CLAIMED, CANCELLED'),
];

export const getProductValidation = [
  param('id')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Invalid product ID'),
];

export const getProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isIn(['name', 'brand', 'type', 'warrantyPeriod', 'startDate', 'endDate', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];
