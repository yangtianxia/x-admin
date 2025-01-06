declare module 'axios' {
  type RequestContentType = 'JSON' | 'FORM_DATA' | 'MULTIPART' | 'OCTET_STREAM'

  interface AxiosRequestConfig {
    /** 取消token */
    abortToken?: string
    /** 响应类型 */
    type?: RequestContentType
    /** 错误提示 */
    errorNotify?: boolean
  }

  interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    request<T = any> (config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    postForm<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    putForm<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patchForm<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  }
}

export {}
