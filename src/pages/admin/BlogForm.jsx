import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { blogService } from '../../services/blogService';
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../hooks/useToast';
import { handleApiError } from '../../utils/handleApiError';
import { FormSkeleton } from '../../components/admin/Skeleton';
import ImageInput from '../../components/admin/ImageInput';

export default function BlogForm() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [postId, setPostId] = useState(null);
  const imageRef = useRef();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    thumbnailUrl: '',
    isPublished: true,
  });

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await blogService.getBySlug(slug);
        const data = res.data.data ?? res.data;
        setPostId(data.id);
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          thumbnailUrl: data.thumbnailUrl || '',
          isPublished: data.isPublished ?? true,
        });
      } catch (err) {
        toast.error(handleApiError(err));
        navigate('/admin/blog');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, isEdit, navigate, toast]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resolvedImageUrl = await imageRef.current.resolve();
      const payload = { ...form, thumbnailUrl: resolvedImageUrl || '' };

      if (isEdit) {
        await blogService.update(postId, payload);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await blogService.create(payload);
        toast.success('Thêm bài viết thành công');
      }
      navigate('/admin/blog');
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FormSkeleton />;

  return (
    <div>
      <button
        onClick={() => navigate('/admin/blog')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Sửa bài viết' : 'Viết bài mới'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-5 max-w-3xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tóm tắt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung *</label>
          <textarea
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            required
            rows={12}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-y"
          />
        </div>

        {/* Thumbnail */}
        <ImageInput
          ref={imageRef}
          value={form.thumbnailUrl}
          uploadFn={uploadService.uploadBlog}
          label="Ảnh đại diện"
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => handleChange('isPublished', e.target.checked)}
            className="w-4 h-4 accent-[#c8a96e] rounded"
          />
          <span className="text-sm">Đăng ngay</span>
        </label>

        <div className="pt-4 border-t border-gray-100 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a2a] disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Đăng bài'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/blog')}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
}
