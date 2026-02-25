import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface RequestConfig extends AxiosRequestConfig {
  showError?: boolean // 是否显示错误提示，默认true
  customError?: boolean // 是否自定义错误处理，默认false
}