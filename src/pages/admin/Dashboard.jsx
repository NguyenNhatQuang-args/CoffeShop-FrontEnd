import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, FolderTree, FileText, MapPin, TrendingUp, Eye } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { blogService } from '../../services/blogService';
import { storeService } from '../../services/storeService';
import { CardSkeleton } from '../../components/admin/Skeleton';

const ACTIVITY_FEED = [
  { id: 1, text: 'Sản phẩm "Cappuccino" đã được cập nhật', time: '5 phút trước' },
  { id: 2, text: 'Bài viết mới "Arabica vs Robusta" đã đăng', time: '1 giờ trước' },
  { id: 3, text: 'Danh mục "Cold Brew" được thêm sản phẩm', time: '2 giờ trước' },
  { id: 4, text: 'Chi nhánh Quận 1 cập nhật giờ hoạt động', time: '3 giờ trước' },
];

const REVENUE_DATA = [
  { label: 'T2', value: 65 },
  { label: 'T3', value: 78 },
  { label: 'T4', value: 52 },
  { label: 'T5', value: 91 },
  { label: 'T6', value: 84 },
  { label: 'T7', value: 110 },
  { label: 'CN', value: 95 },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, categoriesRes, postsRes, storesRes, featuredRes] =
          await Promise.all([
            productService.getAll({ page: 1, pageSize: 1 }),
            categoryService.getAll(),
            blogService.getAll({ page: 1, pageSize: 1 }),
            storeService.getAll(),
            productService.getFeatured(),
          ]);

        const pData = productsRes.data.data ?? productsRes.data;
        const cData = categoriesRes.data.data ?? categoriesRes.data;
        const bData = postsRes.data.data ?? postsRes.data;
        const sData = storesRes.data.data ?? storesRes.data;
        const fData = featuredRes.data.data ?? featuredRes.data;

        setStats({
          products: pData.totalCount ?? (Array.isArray(pData) ? pData.length : 0),
          categories: Array.isArray(cData) ? cData.length : cData.totalCount ?? 0,
          posts: bData.totalCount ?? (Array.isArray(bData) ? bData.length : 0),
          stores: Array.isArray(sData) ? sData.length : sData.totalCount ?? 0,
        });

        setTopProducts(Array.isArray(fData) ? fData.slice(0, 5) : fData.items?.slice(0, 5) ?? []);
      } catch {
        setStats({ products: 0, categories: 0, posts: 0, stores: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.value));

  const overviewCards = [
    { label: 'Sản phẩm', value: stats?.products, icon: Coffee, color: 'bg-amber-50 text-amber-600', link: '/admin/products' },
    { label: 'Danh mục', value: stats?.categories, icon: FolderTree, color: 'bg-blue-50 text-blue-600', link: '/admin/categories' },
    { label: 'Bài viết', value: stats?.posts, icon: FileText, color: 'bg-green-50 text-green-600', link: '/admin/blog' },
    { label: 'Chi nhánh', value: stats?.stores, icon: MapPin, color: 'bg-purple-50 text-purple-600', link: '/admin/stores' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan hệ thống quản lý</p>
      </div>

      {/* Overview Cards */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value ?? 0}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart (fake data) */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Doanh thu tuần này</h3>
              <p className="text-xs text-gray-500 mt-1">Dữ liệu minh hoạ (chưa có API)</p>
            </div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="flex items-end gap-3 h-48">
            {REVENUE_DATA.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#c8a96e]/20 rounded-t-md relative group cursor-pointer"
                  style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                >
                  <div
                    className="absolute bottom-0 w-full bg-[#c8a96e] rounded-t-md transition-all group-hover:bg-[#b8994e]"
                    style={{ height: '100%' }}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.value}M
                  </span>
                </div>
                <span className="text-xs text-gray-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed (fake data) */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <p className="text-xs text-gray-400 mb-4">Dữ liệu minh hoạ</p>
          <div className="space-y-4">
            {ACTIVITY_FEED.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c8a96e] mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Sản phẩm nổi bật</h3>
            <Link to="/admin/products" className="text-sm text-[#c8a96e] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Sản phẩm</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Danh mục</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Giá</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id || p.slug} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 flex items-center gap-3">
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">{p.categoryName || p.category}</td>
                    <td className="py-3 px-2 text-right text-[#c8a96e] font-medium">
                      {p.price?.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
