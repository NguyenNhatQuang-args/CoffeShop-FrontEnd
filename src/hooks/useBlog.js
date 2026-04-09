import { useState, useCallback } from 'react';
import { blogService } from '../services/blogService';
import { handleApiError } from '../utils/handleApiError';
import { useFetch } from './useFetch';

export const useBlog = (params = {}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const { page = 1, pageSize = 10 } = params;

  const { data, loading, error, refetch } = useFetch(
    () => blogService.getAll({ page, pageSize }),
    [page, pageSize]
  );

  const posts = data?.items ?? data ?? [];
  const total = data?.totalCount ?? posts.length;

  const createPost = useCallback(async (postData) => {
    setActionLoading(true);
    try {
      const res = await blogService.create(postData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const updatePost = useCallback(async (id, postData) => {
    setActionLoading(true);
    try {
      const res = await blogService.update(id, postData);
      await refetch();
      return res.data;
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  const deletePost = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await blogService.delete(id);
      await refetch();
    } catch (err) {
      throw new Error(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  }, [refetch]);

  return { posts, total, loading, error, actionLoading, createPost, updatePost, deletePost, refetch };
};
