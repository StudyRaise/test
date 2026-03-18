import type { AppointmentForm } from '@/types';

// 模拟提交请求
export const submitAppointment = async (data: AppointmentForm): Promise<void> => {
  // 模拟网络延迟
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟成功率
      const success = true; 
      if (success) {
        console.log('表单提交成功:', data);
        resolve();
      } else {
        reject(new Error('提交失败，请重试'));
      }
    }, 1500);
  });
};
