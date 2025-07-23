import { LocalCache } from "@/utils/cache";
import { BASE_URL, TIME_OUT } from "./config";
import HYRequest from "./request";
import { TOKEN } from "@/global/constants";

// 创建第一个实例：使用 config 中的 baseURL 和 timeout
export const hyRequest = new HYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,

  // 可选：添加全局拦截器
  interceptors: {
    requestSuccessFn(config) {
      const token = LocalCache.get(TOKEN);
      //请求拦截自动携带token
      if (config.headers && token) {
        config.headers.Authorization = 'Bearer' + token;
        config.headers["Content-Type"] = "application/json";
      }
      return config;
    },
    requestFailureFn(err) {
      return Promise.reject(err);
    },
    responseSuccessFn(response) {
      return response.data;
    },
    responseFailureFn(err) {
      return Promise.reject(err);
    }
  }
});
