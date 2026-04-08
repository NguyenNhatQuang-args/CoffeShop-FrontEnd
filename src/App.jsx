import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<div className="min-h-screen pt-32 text-center text-2xl font-heading">Trang Thực Đơn (Coming Soon)</div>} />
          <Route path="about" element={<div className="min-h-screen pt-32 text-center text-2xl font-heading">Trang Giới Thiệu (Coming Soon)</div>} />
          <Route path="blog" element={<div className="min-h-screen pt-32 text-center text-2xl font-heading">Trang Blog (Coming Soon)</div>} />
          <Route path="lien-he" element={<div className="min-h-screen pt-32 text-center text-2xl font-heading">Trang Liên Hệ (Coming Soon)</div>} />
          <Route path="*" element={<div className="min-h-screen pt-32 text-center text-2xl font-heading">404 - Không tìm thấy trang</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
