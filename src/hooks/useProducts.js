import { useState, useCallback } from 'react';
import { productService } from '../services/productService';
import { handleApiError } from '../utils/handleApiError';
import { useFetch } from './useFetch';

export const useProducts = (params = {}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const { page = 1, pageSize = 10, categoryId, search, tag, isFeature } = params;

  const { data, loading, error, refetch } = useFetch(
    () => productService.getAll({ page, pageSize, categoryId, search, tag, isFeature }),
    [page, pageSize, categoryId, search, tag, isFeature]
  );

  const products = data?.items ?? data ?? [];
  const total = data?.totalCount ?? products.length;

  const createProduct = useCallback(async (formData) => {
    setActionLoading(true);
    try {
      const res = await productService.create(formData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const updateProduct = useCallback(async (id, formData) => {
    setActionLoading(true);
    try {
      const res = await productService.update(id, formData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const deleteProduct = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await productService.delete(id);
      await refetch();
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  return { products, total, loading, error, actionLoading, createProduct, updateProduct, deleteProduct, refetch };
};
