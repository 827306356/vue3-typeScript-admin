import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";

// 定义拦截器接口
export interface HYRequestInterceptors<T = unknown> {
  // 请求拦截器
  requestSuccessFn?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  requestFailureFn?: (error: unknown) => unknown;

  // 响应拦截器
  responseSuccessFn?: <D = T>(response: AxiosResponse<D>) => D | Promise<D>;
  responseFailureFn?: (error: unknown) => unknown;
}

// 请求配置接口
export interface HYRequestConfig<T = unknown> extends AxiosRequestConfig {
  interceptors?: HYRequestInterceptors<T>;
}
