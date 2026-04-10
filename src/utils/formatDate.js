export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatReadTime = (minutes) => {
  if (!minutes) return '';
  return `${minutes} phút đọc`;
};
