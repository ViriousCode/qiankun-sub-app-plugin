import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';

// 定义接口返回的通用格式
// 根据你的后端实际情况修改，通常是 { code: number, data: any, msg: string }
interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg?: string;
  message?: string;
}

class Request {
  private instance: AxiosInstance;
  private isRefreshing = false; // (可选) 用于处理无感刷新 Token

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      timeout: 10000,
      ...config,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 1. 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 【统一】从 Pinia Store 获取 Token
        // 这样做的好处是：当 auth-listener 更新了 Token，这里能立即感知
        const userStore = useUserStore();
        if (userStore.token && config.headers) {
          // 根据后端要求，可能需要加 'Bearer ' 前缀
          config.headers.Authorization = userStore.token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 2. 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const res = response.data;

        // 【统一】成功判断逻辑
        // 兼容处理：有些接口直接返回数据，有些返回标准结构
        if (res.code === 200) {
          return res.data; // 解包：只返回业务数据 data
        }

        // 【统一】业务错误处理
        const msg = res.msg || res.message || '请求失败';
        ElMessage.error(msg);
        
        // 可选：在这里处理 401 Token 过期，重定向到登录
        if (res.code === 401) {
           const userStore = useUserStore();
           userStore.reset();
           // location.href = '/login'; // 或者抛出特定错误让路由守卫处理
        }

        return Promise.reject(new Error(msg));
      },
      (error) => {
        let msg = '网络错误';
        if (error.response && error.response.data) {
           msg = error.response.data.msg || error.response.data.message || error.message;
        } else {
           msg = error.message;
        }
        
        ElMessage.error(msg);
        return Promise.reject(error);
      }
    );
  }

  // --- 封装常用方法 (支持泛型 T) ---
  
  // 基础请求
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, url, method: 'GET' });
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, url, data, method: 'POST' });
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, url, data, method: 'PUT' });
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, url, method: 'DELETE' });
  }
}

// 导出实例
export default new Request({
  // 注意：这里使用 import.meta.env.VITE_BASE_URL
  // 如果子应用以前叫 VITE_BASE_API，请去 .env 文件里改成 VITE_BASE_URL，保持一致
  baseURL: import.meta.env.VITE_BASE_URL 
});