import dayjs from 'dayjs';

// 判断是否为工作日 (周一至周五)
export const isWorkday = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

// 格式化日期
export const formatDate = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

// 手机号验证正则
export const phonePattern = /^1[3-9]\d{9}$/;
