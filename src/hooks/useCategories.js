import { useState, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { handleApiError } from '../utils/handleApiError';
import { useFetch } from './useFetch';

export const useCategories = () => {
  const [actionLoading, setActionLoading] = useState(false);
  const { data, loading, error, refetch } = useFetch(() => categoryService.getAll(), []);

  const categories = data?.items ?? data ?? [];

  const createCategory = useCallback(async (formData) => {
    setActionLoading(true);
    try {
      const res = await categoryService.create(formData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const updateCategory = useCallback(async (id, formData) => {
    setActionLoading(true);
    try {
      const res = await categoryService.update(id, formData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const deleteCategory = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await categoryService.delete(id);
      await refetch();
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  return { categories, loading, error, actionLoading, createCategory, updateCategory, deleteCategory, refetch };
};
