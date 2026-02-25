import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import type { RequestConfig } from './types'

class ErrorHandler {
  // 处理 HTTP 错误（网络层）
  private handleHttpError(error: AxiosError): void {
    if (!error.response) {
      // 无响应（网络错误、超时等）
      ElMessage.error('网络连接异常，请检查网络后重试')
      return
    }

    const status = error.response.status
    switch (status) {
      case 400:
        ElMessage.error('请求参数错误')
        break
      case 401:
        ElMessage.error('登录已过期，请重新登录')
        this.redirectToLogin()
        break
      case 403:
        ElMessage.error('没有权限访问该资源')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
      case 502:
      case 503:
        ElMessage.error('服务器异常，请稍后重试')
        break
      default:
        ElMessage.error(`网络错误 (${status})`)
    }
  }

  // 处理业务错误（业务层）
  private handleBusinessError(code: number, message: string): void {
    // 可根据业务需求定制不同错误码的处理
    if (code === 1001) {
      ElMessage.warning('操作失败：' + message)
    } else if (code === 1002) {
      ElMessage.error('数据验证失败')
    } else {
      ElMessage.error(message || '操作失败')
    }
  }

  // 重定向到登录页
  private redirectToLogin(): void {
    // 清除用户信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')

    // 跳转到登录页，根据你的路由配置调整
    setTimeout(() => {
      window.location.href = '/login'
    }, 1500)
  }

  // 公共错误处理方法
  public handle(error: AxiosError, config: RequestConfig): void {
    if (config.customError) {
      // 自定义错误处理，不显示默认提示
      return
    }

    if (config.showError === false) {
      // 明确要求不显示错误
      return
    }

    if (error.response) {
      const { data } = error.response
      if (data && typeof data === 'object' && 'code' in data && 'message' in data) {
        // 业务错误
        if (typeof data.code === 'string') {
          data.code = Number(data.code)
        }
        this.handleBusinessError(data.code as number, data.message as string)
      } else {
        // HTTP 错误
        this.handleHttpError(error)
      }
    } else {
      // 其他错误
      ElMessage.error('请求发送失败，请检查网络')
    }
  }
}

export const errorHandler = new ErrorHandler()