import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Upload, X, AlertTriangle } from 'lucide-react';

/**
 * ImageInput - Component upload ảnh dùng chung cho admin forms.
 *
 * Props:
 *   value     - URL ảnh hiện tại (khi edit)
 *   uploadFn  - Hàm upload file, nhận File → trả Promise (response từ server)
 *   label     - Label hiển thị (mặc định "Hình ảnh")
 *
 * Ref methods:
 *   resolve() - Gọi trước khi submit, trả về URL ảnh cuối cùng (upload nếu cần)
 */
const ImageInput = forwardRef(({ value = '', uploadFn, label = 'Hình ảnh' }, ref) => {
  const isExternalUrl = value && /^https?:\/\//i.test(value) && !value.includes('/uploads/');

  const [mode, setMode] = useState(isExternalUrl ? 'url' : 'upload');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(!isExternalUrl ? value : '');
  const [urlInput, setUrlInput] = useState(isExternalUrl ? value : '');
  const [urlPreview, setUrlPreview] = useState(isExternalUrl ? value : '');
  const [urlError, setUrlError] = useState(false);

  // Sync khi value thay đổi từ bên ngoài (load data edit)
  useEffect(() => {
    const ext = value && /^https?:\/\//i.test(value) && !value.includes('/uploads/');
    if (ext) {
      setMode('url');
      setUrlInput(value);
      setUrlPreview(value);
      setFilePreview('');
      setFile(null);
    } else if (value) {
      setMode('upload');
      setFilePreview(value);
      setUrlInput('');
      setUrlPreview('');
      setFile(null);
    }
  }, [value]);

  // Expose resolve() cho parent gọi trước submit
  useImperativeHandle(ref, () => ({
    resolve: async () => {
      if (mode === 'url') {
        return urlInput.trim() || null;
      }
      if (mode === 'upload' && file) {
        const res = await uploadFn(file);
        return res.data.data?.url ?? res.data.url ?? res.data;
      }
      // Không thay đổi → giữ ảnh cũ
      return filePreview || null;
    },
  }));

  // Debounce URL preview (600ms)
  useEffect(() => {
    if (mode !== 'url') return;
    setUrlError(false);
    setUrlPreview('');
    if (!urlInput.trim()) return;
    const timer = setTimeout(() => {
      setUrlPreview(urlInput.trim());
    }, 600);
    return () => clearTimeout(timer);
  }, [urlInput, mode]);

  // Cleanup object URL khi unmount hoặc thay file
  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(filePreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    if (newMode === 'upload') {
      setUrlInput('');
      setUrlPreview('');
      setUrlError(false);
    } else {
      setFile(null);
      setFilePreview('');
    }
  };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>

      {/* Tabs */}
      <div className="flex gap-0 mb-3 border-b border-gray-200">
        <button
          type="button"
          onClick={() => switchMode('upload')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            mode === 'upload'
              ? 'border-[#c8a96e] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📁 Upload file
        </button>
        <button
          type="button"
          onClick={() => switchMode('url')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            mode === 'url'
              ? 'border-[#c8a96e] text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🔗 Đường link URL
        </button>
      </div>

      {/* Upload mode */}
      {mode === 'upload' &&
        (filePreview ? (
          <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100">
            <img src={filePreview} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#c8a96e] transition-colors">
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-xs text-gray-500">Chọn ảnh</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        ))}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="space-y-3">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
          />
          {urlPreview &&
            (urlError ? (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                <AlertTriangle size={16} />
                URL ảnh không hợp lệ
              </div>
            ) : (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={urlPreview}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setUrlError(true)}
                  onLoad={() => setUrlError(false)}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
});

ImageInput.displayName = 'ImageInput';

export default ImageInput;
