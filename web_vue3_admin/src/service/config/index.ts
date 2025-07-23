// 根据当前模式自动选择不同的基础 URL
let BASE_URL = ''
export const TIME_OUT = 10000
if (import.meta.env.PROD) {
  BASE_URL = 'http://152.136.185.210:5000'
} else {
  BASE_URL = ''
}

export { BASE_URL }



