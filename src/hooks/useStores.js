import { useState, useCallback } from 'react';
import { storeService } from '../services/storeService';
import { handleApiError } from '../utils/handleApiError';
import { useFetch } from './useFetch';

export const useStores = () => {
  const [actionLoading, setActionLoading] = useState(false);
  const { data, loading, error, refetch } = useFetch(() => storeService.getAll(), []);

  const stores = data?.items ?? data ?? [];

  const createStore = useCallback(async (storeData) => {
    setActionLoading(true);
    try {
      const res = await storeService.create(storeData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const updateStore = useCallback(async (id, storeData) => {
    setActionLoading(true);
    try {
      const res = await storeService.update(id, storeData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const deleteStore = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await storeService.delete(id);
      await refetch();
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  return { stores, loading, error, actionLoading, createStore, updateStore, deleteStore, refetch };
};
