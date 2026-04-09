import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { uploadService } from '../../services/uploadService';
import { useCategories } from '../../hooks/useCategories';
import { useToast } from '../../hooks/useToast';
import { handleApiError } from '../../utils/handleApiError';
import { FormSkeleton } from '../../components/admin/Skeleton';

export default function ProductForm() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();
  const toast = useToast();
  const { categories } = useCategories();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productId, setProductId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    tag: '',
    isAvailable: true,
    isFeature: false,
    imageUrl: '',
  });

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await productService.getBySlug(slug);
        const data = res.data.data ?? res.data;
        setProductId(data.id);
        setForm({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          categoryId: data.categoryId || '',
          tag: data.tag || '',
          isAvailable: data.isAvailable ?? true,
          isFeature: data.isFeature ?? false,
          imageUrl: data.imageUrl || '',
        });
      } catch (err) {
        toast.error(handleApiError(err));
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, isEdit, navigate, toast]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadService.uploadProduct(file);
      const url = res.data.data?.url ?? res.data.url ?? res.data;
      handleChange('imageUrl', url);
      toast.success('Upload anh thanh cong');
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('categoryId', form.categoryId);
    formData.append('tag', form.tag);
    formData.append('isAvailable', form.isAvailable);
    formData.append('isFeature', form.isFeature);
    if (form.imageUrl) formData.append('imageUrl', form.imageUrl);

    try {
      if (isEdit) {
        await productService.update(productId, formData);
        toast.success('Cap nhat san pham thanh cong');
      } else {
        await productService.create(formData);
        toast.success('Them san pham thanh cong');
      }
      navigate('/admin/products');
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
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Quay lai
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Sua san pham' : 'Them san pham moi'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ten san pham *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
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
              placeholder="tu-dong-tao-neu-de-trong"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mo ta</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Gia (VND) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              required
              min="0"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh muc *</label>
            <select
              value={form.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            >
              <option value="">Chon danh muc</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tag</label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => handleChange('tag', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              placeholder="BEST SELLER, MOI, ..."
            />
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hinh anh</label>
          {form.imageUrl ? (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100">
              <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleChange('imageUrl', '')}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#c8a96e] transition-colors">
              {uploading ? (
                <Loader2 size={24} className="animate-spin text-gray-400" />
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Chon anh</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => handleChange('isAvailable', e.target.checked)}
              className="w-4 h-4 accent-[#c8a96e] rounded"
            />
            <span className="text-sm">Con hang</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeature}
              onChange={(e) => handleChange('isFeature', e.target.checked)}
              className="w-4 h-4 accent-[#c8a96e] rounded"
            />
            <span className="text-sm">Noi bat</span>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a2a] disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Cap nhat' : 'Them moi'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Huy
          </button>
        </div>
      </form>
    </div>
  );
}
