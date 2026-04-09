import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Coffee, FolderTree, FileText, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Sản phẩm', path: '/admin/products', icon: Coffee },
  { name: 'Danh mục', path: '/admin/categories', icon: FolderTree },
  { name: 'Blog', path: '/admin/blog', icon: FileText },
  { name: 'Chi nhánh', path: '/admin/stores', icon: MapPin },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1a1a] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="font-heading text-xl font-bold tracking-wider text-[#c8a96e]">
          ADMIN PANEL
        </h1>
        {user && (
          <p className="text-xs text-gray-400 mt-1 truncate">{user.email || user.fullName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#c8a96e] text-[#1a1a1a]'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
