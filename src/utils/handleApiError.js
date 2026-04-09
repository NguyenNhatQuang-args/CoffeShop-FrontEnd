export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) return 'Phiên đăng nhập hết hạn';
    if (status === 403) return 'Bạn không có quyền thực hiện';
    if (status === 404) return 'Không tìm thấy dữ liệu';
    if (status === 422) return data.errors?.[0] || 'Dữ liệu không hợp lệ';
    return data.message || 'Lỗi từ máy chủ';
  }
  if (error.request) return 'Không thể kết nối đến máy chủ';
  return 'Có lỗi xảy ra, vui lòng thử lại';
};
