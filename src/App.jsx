import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import BlogPublic from './pages/BlogPublic';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';
import Blog from './pages/admin/Blog';
import BlogForm from './pages/admin/BlogForm';
import Stores from './pages/admin/Stores';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<BlogPublic />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="lien-he" element={<Contact />} />
              <Route path="*" element={<div className="min-h-screen pt-32 text-center text-2xl font-heading">404 - Không tìm thấy trang</div>} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:slug/edit" element={<ProductForm />} />
              <Route path="categories" element={<Categories />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/new" element={<BlogForm />} />
              <Route path="blog/:slug/edit" element={<BlogForm />} />
              <Route path="stores" element={<Stores />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
