# Menu API Integration — Test Checklist

## Cơ bản
- [ ] Load trang /menu → hiện đúng danh sách sản phẩm từ DB
- [ ] Hiện skeleton loading khi đang tải dữ liệu
- [ ] Hiện tổng số sản phẩm chính xác (X / total)

## Bộ lọc
- [ ] Category filter hoạt động → đổi category → grid reload
- [ ] Search "cappuccino" → hiện đúng sản phẩm (debounce 400ms)
- [ ] Sort giá tăng dần → thứ tự đúng
- [ ] Sort giá giảm dần → thứ tự đúng
- [ ] Sort tên A-Z → thứ tự đúng
- [ ] Toggle "Chỉ hiện còn hàng" → ẩn sản phẩm hết hàng
- [ ] Đặt lại bộ lọc → reset tất cả về mặc định

## Product Detail Modal
- [ ] Click "Xem chi tiết" → modal mở, hiện loading spinner
- [ ] Modal load xong → hiện data đúng (tên, mô tả, hình, category, tag)
- [ ] Chọn Size trong modal → giá cập nhật đúng
- [ ] Chọn Nhiệt độ → danh sách size cập nhật theo
- [ ] Sản phẩm không có variants → hiện giá cố định, ẩn size selector
- [ ] Sản phẩm isActive=false → hiện "Tạm hết hàng", disable size/temp

## Phân trang
- [ ] Pagination hiển thị khi có nhiều hơn 1 trang
- [ ] Chuyển trang → load đúng sản phẩm
- [ ] Chuyển trang → scroll lên đầu grid

## Trạng thái lỗi
- [ ] Mất kết nối backend → hiện error banner đỏ nhạt
- [ ] Nhấn "Thử lại" → gọi lại API
- [ ] Không có kết quả → hiện empty state + nút "Đặt lại bộ lọc"

## Hình ảnh
- [ ] Ảnh có path tương đối (/uploads/...) → hiện đúng qua https://localhost:7239
- [ ] Ảnh có URL đầy đủ (https://...) → hiện đúng

## Mobile
- [ ] FAB button mở filter drawer trên mobile
- [ ] Filter trong drawer hoạt động giống desktop
- [ ] Đóng drawer bằng nút X hoặc tap backdrop

## URL Params
- [ ] Truy cập /menu?category=espresso → filter đúng category
