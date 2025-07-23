import axios, { type AxiosInstance } from "axios";
import type { HYRequestConfig, HYRequestInterceptors } from "./type";

class HYRequest {
  instance: AxiosInstance;

  constructor(config: HYRequestConfig) {
    this.instance = axios.create({
      ...config,
      baseURL: config.baseURL,
      timeout: config.timeout ?? 10000,
    });

    // 添加全局拦截器
    this.setupGlobalInterceptors();

    // 添加实例级别的拦截器
    if (config.interceptors) {
      this.setupInterceptors(config.interceptors);
    }
  }

  private setupGlobalInterceptors(): void {
    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log("全局请求成功的拦截");
        return config;
      },
      (err) => {
        console.log("全局请求失败的拦截");
        return Promise.reject(err);
      }
    );

    // 全局响应拦截器
    this.instance.interceptors.response.use(
      (res) => {
        console.log("全局响应成功的拦截");
        return res;
      },
      (err) => {
        console.log("全局响应失败的拦截");
        return Promise.reject(err);
      }
    );
  }

  private setupInterceptors<T>(interceptors: HYRequestInterceptors<T>): void {
    // 请求拦截器
    if (interceptors.requestSuccessFn || interceptors.requestFailureFn) {
      this.instance.interceptors.request.use(
        interceptors.requestSuccessFn ?? ((config) => config),
        interceptors.requestFailureFn ?? ((error) => Promise.reject(error))
      );
    }

    // 响应拦截器
    if (interceptors.responseSuccessFn || interceptors.responseFailureFn) {
      this.instance.interceptors.response.use(
        interceptors.responseSuccessFn
          ? (res) => interceptors.responseSuccessFn!(res)
          : (res) => res,
        interceptors.responseFailureFn ?? ((error) => Promise.reject(error))
      );
    }
  }

  request<T = unknown>(config: HYRequestConfig<T>): Promise<T> {
    return this.instance.request<T, T>(config); // 正确泛型顺序：<TResponse, TRequest>
  }

  get<T = unknown>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "GET" });
  }

  post<T = unknown>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "POST" });
  }

  delete<T = unknown>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE" });
  }

  patch<T = unknown>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH" });
  }
}

export default HYRequest;
