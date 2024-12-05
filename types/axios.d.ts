declare module 'axios' {
  type RequestContentType = 'JSON' | 'FORM_DATA' | 'MULTIPART' | 'XML' | 'OCTET_STREAM'

  interface AxiosRequestConfig {
    /** 取消请求token */
    abortToken?: string
    /** 请求内容类型 */
    type?: RequestContentType
  }

  interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    request<T = any> (config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }
}

export {}
