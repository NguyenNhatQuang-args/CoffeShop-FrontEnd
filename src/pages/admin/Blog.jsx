import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useBlog } from '../../hooks/useBlog';
import { useToast } from '../../hooks/useToast';
import { getImageUrl } from '../../utils/getImageUrl';
import { TableSkeleton } from '../../components/admin/Skeleton';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const TABS = ['Tất cả', 'Đã đăng', 'Bản nháp'];

export default function Blog() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toast = useToast();
  const { posts, total, loading, actionLoading, deletePost } = useBlog({ page, pageSize: 10 });

  const totalPages = Math.ceil(total / 10);

  const filteredPosts = activeTab === 'Tất cả'
    ? posts
    : activeTab === 'Đã đăng'
    ? posts.filter((p) => p.isPublished !== false)
    : posts.filter((p) => p.isPublished === false);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deletePost(deleteTarget.id);
      toast.success('Đã xoá bài viết');
    } catch (err) {
      toast.error(err.message);
    }
    setDeleteTarget(null);
  }, [deleteTarget, deletePost, toast]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">{total} bài viết</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus size={16} />
          Viết bài mới
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#c8a96e] text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Tiêu đề</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Ngày tạo</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Trạng thái</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">
                    Không có bài viết nào
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {post.thumbnailUrl && (
                          <img src={getImageUrl(post.thumbnailUrl)} alt="" className="w-12 h-8 rounded object-cover bg-gray-100" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[300px]">{post.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[300px]">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          post.isPublished !== false
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {post.isPublished !== false ? 'Đã đăng' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/blog/${post.slug || post.id}/edit`}
                          className="p-2 text-gray-400 hover:text-[#c8a96e] hover:bg-[#c8a96e]/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(post)}
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">Trang {page} / {totalPages}</p>
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
        title="Xoá bài viết"
        message={`Bạn có chắc muốn xoá "${deleteTarget?.title}"?`}
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
