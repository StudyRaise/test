import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { showNotify, showToast } from 'vant';
import type { ApiResponse } from '@/types';

// 1. 创建 axios 实例
const service = axios.create({
  // 环境变量中获取 base url，如果没有则默认为空或 /api
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 2. 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取 token (这里假设存在 localStorage 中)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    
    // 这里约定 code 为 200 表示成功
    if (res.code === 200) {
      return res.data; // 直接返回业务数据
    } else {
      // 业务错误处理
      showNotify({ type: 'warning', message: res.message || '操作失败' });
      
      // 特定错误码处理，例如 401 token 失效
      if (res.code === 401) {
        // 清除 token 并跳转登录页
        localStorage.removeItem('token');
        // router.push('/login'); // 需要引入 router
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
  },
  (error) => {
    // HTTP 状态码错误处理
    let message = '';
    const status = error.response?.status;
    
    switch (status) {
      case 400: message = '请求参数错误'; break;
      case 401: message = '未授权，请重新登录'; break;
      case 403: message = '拒绝访问'; break;
      case 404: message = '请求地址不存在'; break;
      case 500: message = '服务器内部错误'; break;
      default: message = '网络连接故障';
    }
    
    showToast(message);
    return Promise.reject(error);
  }
);

// 导出封装后的请求对象
const request = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config }) as Promise<T>;
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config) as Promise<T>;
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config) as Promise<T>;
  },

  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config }) as Promise<T>;
  }
};

export default request;
