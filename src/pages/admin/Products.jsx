import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useToast } from '../../hooks/useToast';
import { handleApiError } from '../../utils/handleApiError';
import { productService } from '../../services/productService';
import { TableSkeleton } from '../../components/admin/Skeleton';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function Products() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toast = useToast();
  const { categories } = useCategories();
  const { products, total, loading, actionLoading, deleteProduct, refetch } = useProducts({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
    categoryId: categoryFilter || undefined,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = Math.ceil(total / 10);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      toast.success('Đã xoá sản phẩm');
    } catch (err) {
      toast.error(err.message);
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteProduct, toast]);

  const toggleAvailability = useCallback(async (product) => {
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('categoryId', product.categoryId);
      formData.append('isActive', !product.isActive);
      formData.append('isFeatured', product.isFeatured);
      if (product.imageUrl) formData.append('imageUrl', product.imageUrl);
      await productService.update(product.id, formData);
      toast.success(product.isActive ? 'Đã ẩn sản phẩm' : 'Đã hiện sản phẩm');
      refetch();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  }, [refetch, toast]);

  const formatPrice = (minPrice, maxPrice) => {
    if (minPrice == null && maxPrice == null) return '—';
    const min = (minPrice || 0).toLocaleString('vi-VN');
    const max = (maxPrice || 0).toLocaleString('vi-VN');
    if (minPrice === maxPrice) return `${min} đ`;
    return `${min} - ${max} đ`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">{total} sản phẩm</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Sản phẩm</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Danh mục</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Giá</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">Trạng thái</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {p.imageUrl && (
                            <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{p.name}</p>
                            {p.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.tags.map((tag, i) => (
                                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-[#c8a96e]/20 text-[#c8a96e] rounded uppercase">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{p.categoryName || '-'}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {formatPrice(p.minPrice, p.maxPrice)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleAvailability(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            p.isActive
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {p.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                          {p.isActive ? 'Hiển thị' : 'Đã ẩn'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${p.slug || p.id}/edit`}
                            className="p-2 text-gray-400 hover:text-[#c8a96e] hover:bg-[#c8a96e]/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá sản phẩm"
        message={`Bạn có chắc muốn xoá "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
