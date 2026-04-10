import { useState, useEffect, useMemo, useCallback } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { handleApiError } from '../utils/handleApiError';
import { getImageUrl } from '../utils/getImageUrl';
import useDebounce from './useDebounce';

const useMenu = () => {
  // ---------- data state ----------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- filter state ----------
  const [filters, setFilters] = useState({
    search: '',
    categorySlug: 'all',
    temps: [],            // ['Nóng', 'Đá']
    onlyAvailable: false,
    sortBy: 'default',    // 'price-asc' | 'price-desc' | 'name-az'
    page: 1,
    pageSize: 12,
  });

  // ---------- debounced search ----------
  const debouncedSearch = useDebounce(filters.search, 400);

  // ---------- fetch categories once ----------
  useEffect(() => {
    categoryService.getAll()
      .then((res) => {
        const list = res.data.data ?? res.data;
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(handleApiError(err)));
  }, []);

  // ---------- helper: slug → categoryId ----------
  const getCategoryId = useCallback(
    (slug) => {
      if (!slug || slug === 'all') return undefined;
      const cat = categories.find((c) => c.slug === slug);
      return cat?.id;
    },
    [categories],
  );

  // ---------- fetch products when filters change ----------
  useEffect(() => {
    // Don't fetch products until categories are loaded (needed for id lookup)
    // But if user hasn't picked a category, we can go ahead
    if (filters.categorySlug !== 'all' && categories.length === 0) return;

    const params = {
      search: debouncedSearch || undefined,
      categoryId: getCategoryId(filters.categorySlug) || undefined,
      page: filters.page,
      pageSize: filters.pageSize,
    };

    setLoading(true);
    setError(null);

    productService.getAll(params)
      .then((res) => {
        const paged = res.data.data ?? res.data;
        const items = (paged.items ?? []).map((p) => ({
          ...p,
          imageUrl: getImageUrl(p.imageUrl),
        }));
        setProducts(items);
        setTotal(paged.totalCount ?? 0);
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.categorySlug, filters.page, filters.pageSize, categories, getCategoryId]);

  // ---------- client-side filters & sort ----------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Temperature filter (client-side — list endpoint doesn't include variants,
    // but detail does. We'll skip temp filter on list if no variant data.)
    // Products from list endpoint don't have variants, so we skip temp filter here.
    // Temp filter will work if backend ever includes temp info in list response.

    // Availability filter (isActive from backend)
    if (filters.onlyAvailable) {
      result = result.filter((p) => p.isActive !== false);
    }

    // Sort (backend doesn't support sortBy)
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.minPrice ?? 0) - (b.minPrice ?? 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.minPrice ?? 0) - (a.minPrice ?? 0));
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
    }

    return result;
  }, [products, filters.onlyAvailable, filters.sortBy]);

  // ---------- retry helper ----------
  const retry = useCallback(() => {
    // Trigger re-fetch by bumping a no-op state change
    setFilters((prev) => ({ ...prev }));
  }, []);

  return {
    products: filteredProducts,
    categories,
    total,
    loading,
    error,
    filters,
    setFilters,
    retry,
  };
};

export default useMenu;
