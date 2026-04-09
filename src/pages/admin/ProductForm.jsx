import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Trash2, X } from 'lucide-react';
import { productService } from '../../services/productService';
import { uploadService } from '../../services/uploadService';
import { useCategories } from '../../hooks/useCategories';
import { useToast } from '../../hooks/useToast';
import { handleApiError } from '../../utils/handleApiError';
import { FormSkeleton } from '../../components/admin/Skeleton';
import ImageInput from '../../components/admin/ImageInput';

const SIZE_OPTIONS = ['S', 'M', 'L'];
const TEMP_OPTIONS = ['Hot', 'Cold', 'Both'];

const emptyVariant = () => ({ sizeName: 'M', temperature: 'Hot', price: '', isAvailable: true });

export default function ProductForm() {
  const { slug } = useParams();
  const isEdit = !!slug;
  const navigate = useNavigate();
  const toast = useToast();
  const { categories } = useCategories();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [productId, setProductId] = useState(null);
  const imageRef = useRef();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    isActive: true,
    isFeatured: false,
    imageUrl: '',
  });
  const [variants, setVariants] = useState([emptyVariant()]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

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
          categoryId: data.categoryId || '',
          isActive: data.isActive ?? true,
          isFeatured: data.isFeatured ?? false,
          imageUrl: data.imageUrl || '',
        });
        if (data.variants?.length > 0) {
          setVariants(data.variants.map(v => ({
            sizeName: v.sizeName || 'M',
            temperature: v.temperature || 'Hot',
            price: v.price?.toString() || '',
            isAvailable: v.isAvailable ?? true,
          })));
        }
        if (data.tags?.length > 0) {
          setTags(data.tags);
        }
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

  // --- Variants ---
  const addVariant = () => setVariants(prev => [...prev, emptyVariant()]);

  const updateVariant = (index, field, value) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // --- Tags ---
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (variants.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 biến thể (size/giá)');
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].price || Number(variants[i].price) <= 0) {
        toast.error(`Biến thể ${i + 1}: Giá phải lớn hơn 0`);
        return;
      }
    }

    setSubmitting(true);

    try {
      // Resolve ảnh trước khi submit
      const resolvedImageUrl = await imageRef.current.resolve();

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description || '');
      formData.append('isActive', form.isActive);
      formData.append('isFeatured', form.isFeatured);
      formData.append('categoryId', form.categoryId);
      if (resolvedImageUrl) formData.append('imageUrl', resolvedImageUrl);

      // Variants - ASP.NET Core indexed binding
      variants.forEach((v, i) => {
        formData.append(`Variants[${i}].SizeName`, v.sizeName);
        formData.append(`Variants[${i}].Temperature`, v.temperature);
        formData.append(`Variants[${i}].Price`, v.price);
        formData.append(`Variants[${i}].IsAvailable`, v.isAvailable);
      });

      // Tags - ASP.NET Core indexed binding
      tags.forEach((t, i) => {
        formData.append(`Tags[${i}]`, t);
      });

      if (isEdit) {
        await productService.update(productId, formData);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await productService.create(formData);
        toast.success('Thêm sản phẩm thành công');
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
        Quay lại
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Thông tin cơ bản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên sản phẩm *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục *</label>
              <select
                value={form.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e] resize-none"
            />
          </div>

          {/* Image input */}
          <ImageInput
            ref={imageRef}
            value={form.imageUrl}
            uploadFn={uploadService.uploadProduct}
          />

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-4 h-4 accent-[#c8a96e] rounded"
              />
              <span className="text-sm">Còn hàng</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="w-4 h-4 accent-[#c8a96e] rounded"
              />
              <span className="text-sm">Nổi bật</span>
            </label>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Biến thể & Giá</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 text-sm text-[#c8a96e] hover:text-[#b8994e] font-medium transition-colors"
            >
              <Plus size={14} />
              Thêm biến thể
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.</p>
          ) : (
            <div className="space-y-3">
              {/* Header */}
              <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 text-xs font-medium text-gray-500 px-1">
                <span>Size</span>
                <span>Nhiệt độ</span>
                <span>Giá (VND)</span>
                <span className="w-20 text-center">Còn hàng</span>
                <span className="w-10"></span>
              </div>

              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 items-center bg-gray-50 rounded-lg p-3 md:p-2">
                  <select
                    value={v.sizeName}
                    onChange={(e) => updateVariant(i, 'sizeName', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                  >
                    {SIZE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    value={v.temperature}
                    onChange={(e) => updateVariant(i, 'temperature', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                  >
                    {TEMP_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(i, 'price', e.target.value)}
                    placeholder="VD: 45000"
                    min="0"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                  />
                  <label className="flex items-center justify-center w-20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={v.isAvailable}
                      onChange={(e) => updateVariant(i, 'isAvailable', e.target.checked)}
                      className="w-4 h-4 accent-[#c8a96e] rounded"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Tags</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Nhập tag rồi nhấn Enter hoặc nút Thêm..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 bg-gray-100 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Thêm
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c8a96e]/15 text-[#c8a96e] text-sm font-medium rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(i)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a2a] disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
}
