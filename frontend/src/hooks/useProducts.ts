import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useRef } from 'react';
import { RootState, AppDispatch } from '@/store';
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductStats,
  clearError,
  clearCurrentProduct,
  setCurrentProduct,
} from '@/store/slices/productSlice';
import { CreateProductRequest, UpdateProductRequest, PaginationParams } from '@/types';

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, currentProduct, stats, loading, error, pagination } = useSelector(
    (state: RootState) => state.products
  );
  
  // Debounce ref for stats fetching
  const statsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFetchProducts = useCallback(async (params?: PaginationParams) => {
    const result = await dispatch(fetchProducts(params));
    return result;
  }, [dispatch]);

  const handleFetchProduct = useCallback(async (id: string) => {
    const result = await dispatch(fetchProduct(id));
    return result;
  }, [dispatch]);

  const handleCreateProduct = useCallback(async (productData: CreateProductRequest) => {
    const result = await dispatch(createProduct(productData));
    return result;
  }, [dispatch]);

  const handleUpdateProduct = useCallback(async (id: string, data: UpdateProductRequest) => {
    const result = await dispatch(updateProduct({ id, data }));
    return result;
  }, [dispatch]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    const result = await dispatch(deleteProduct(id));
    return result;
  }, [dispatch]);

  const handleFetchProductStats = useCallback(async () => {
    // Clear any existing timeout
    if (statsTimeoutRef.current) {
      clearTimeout(statsTimeoutRef.current);
    }
    
    // Debounce the stats fetch by 500ms
    return new Promise((resolve) => {
      statsTimeoutRef.current = setTimeout(async () => {
        const result = await dispatch(fetchProductStats());
        resolve(result);
      }, 500);
    });
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearCurrentProduct = useCallback(() => {
    dispatch(clearCurrentProduct());
  }, [dispatch]);

  const handleSetCurrentProduct = useCallback((product: any) => {
    dispatch(setCurrentProduct(product));
  }, [dispatch]);

  return {
    products,
    currentProduct,
    stats,
    loading,
    error,
    pagination,
    fetchProducts: handleFetchProducts,
    fetchProduct: handleFetchProduct,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    fetchProductStats: handleFetchProductStats,
    clearError: handleClearError,
    clearCurrentProduct: handleClearCurrentProduct,
    setCurrentProduct: handleSetCurrentProduct,
  };
};
