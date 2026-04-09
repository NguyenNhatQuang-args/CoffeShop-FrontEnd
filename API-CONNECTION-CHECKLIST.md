# API Connection Checklist

## Backend URL
- Dev: `https://localhost:7239` (proxied via Vite → `/api`)
- Auth: JWT stored in HttpOnly Cookies (AuthToken + RefreshToken)

## Endpoints da ket noi

### Auth
| Method | Endpoint | Trang su dung | Trang thai |
|--------|----------|---------------|------------|
| POST | `/api/auth/login` | AdminLogin | Da ket noi |
| POST | `/api/auth/logout` | AdminSidebar (logout) | Da ket noi |
| POST | `/api/auth/refresh` | api.js interceptor (auto) | Da ket noi |

### Products
| Method | Endpoint | Trang su dung | Trang thai |
|--------|----------|---------------|------------|
| GET | `/api/products?page&pageSize&categoryId&search&tag&isFeature` | Products, Dashboard | Da ket noi |
| GET | `/api/products/:slug` | ProductForm (edit) | Da ket noi |
| GET | `/api/products/featured` | Dashboard (top products) | Da ket noi |
| POST | `/api/admin/products` | ProductForm (create) | Da ket noi |
| PUT | `/api/admin/products/:id` | ProductForm (edit), Products (toggle) | Da ket noi |
| DELETE | `/api/admin/products/:id` | Products (delete) | Da ket noi |

### Categories
| Method | Endpoint | Trang su dung | Trang thai |
|--------|----------|---------------|------------|
| GET | `/api/categories` | Categories, Products (filter) | Da ket noi |
| GET | `/api/categories/:slug` | (san sang) | Da ket noi |
| POST | `/api/admin/categories` | Categories (modal create) | Da ket noi |
| PUT | `/api/admin/categories/:id` | Categories (modal edit) | Da ket noi |
| DELETE | `/api/admin/categories/:id` | Categories (delete) | Da ket noi |

### Blog
| Method | Endpoint | Trang su dung | Trang thai |
|--------|----------|---------------|------------|
| GET | `/api/blog?page&pageSize` | Blog | Da ket noi |
| GET | `/api/blog/:slug` | BlogForm (edit) | Da ket noi |
| POST | `/api/admin/blog` | BlogForm (create) | Da ket noi |
| PUT | `/api/admin/blog/:id` | BlogForm (edit) | Da ket noi |
| DELETE | `/api/admin/blog/:id` | Blog (delete) | Da ket noi |

### Stores
| Method | Endpoint | Trang su dung | Trang thai |
|--------|----------|---------------|------------|
| GET | `/api/stores` | Stores, Dashboard | Da ket noi |
| POST | `/api/admin/stores` | Stores (modal create) | Da ket noi |
| PUT | `/api/admin/stores/:id` | Stores (modal edit, toggle) | Da ket noi |
| DELETE | `/api/admin/stores/:id` | Stores (delete) | Da ket noi |

### Upload
| Method | Endpoint | Trang su dung | Trang thai |
|--------|----------|---------------|------------|
| POST | `/api/admin/upload/product` | ProductForm | Da ket noi |
| POST | `/api/admin/upload/category` | Categories modal | Da ket noi |
| POST | `/api/admin/upload/blog` | BlogForm | Da ket noi |
| DELETE | `/api/admin/upload` | (san sang) | Da ket noi |

## Phan con dung data fake

| Phan | Li do | Ghi chu |
|------|-------|---------|
| Dashboard - Bieu do doanh thu | Backend chua co endpoint doanh thu | Data minh hoa 7 ngay |
| Dashboard - Activity Feed | Backend chua co endpoint activity log | 4 muc hardcode |
| Trang Public (Home, Menu) | Thiet ke dung hardcode constants | Khong anh huong admin |

## Huong dan test

```bash
# 1. Chay backend truoc
cd CoffeeShop.API
dotnet run
# Backend se chay tai https://localhost:7239

# 2. Chay frontend
cd RoxiosLand-Coffee
npm install
npm run dev
# Frontend se chay tai http://localhost:5173

# 3. Test tung trang
# - Truy cap http://localhost:5173/admin/login
# - Dang nhap voi tai khoan admin
# - Kiem tra tung trang: Dashboard, Products, Categories, Blog, Stores
# - Thu CRUD (them/sua/xoa) cho tung module
# - Thu upload hinh anh
# - Thu logout va login lai
```

## Cau truc file

```
src/
├── services/          # API calls
│   ├── api.js         # Axios instance + interceptors
│   ├── authService.js
│   ├── productService.js
│   ├── categoryService.js
│   ├── blogService.js
│   ├── storeService.js
│   └── uploadService.js
├── hooks/             # Custom hooks
│   ├── useAuth.js
│   ├── useToast.js
│   ├── useFetch.js
│   ├── useProducts.js
│   ├── useCategories.js
│   ├── useBlog.js
│   └── useStores.js
├── context/           # React Context
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
├── utils/
│   └── handleApiError.js
├── components/admin/
│   ├── AdminLayout.jsx
│   ├── AdminSidebar.jsx
│   ├── Skeleton.jsx
│   └── ConfirmDialog.jsx
└── pages/admin/
    ├── AdminLogin.jsx
    ├── Dashboard.jsx
    ├── Products.jsx
    ├── ProductForm.jsx
    ├── Categories.jsx
    ├── Blog.jsx
    ├── BlogForm.jsx
    └── Stores.jsx
```
