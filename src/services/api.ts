import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = 'https://gspkyxp4p6.ap-south-1.awsapprunner.com/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.params);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url, response.data);
        return response;
      },
      async (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Clear tokens and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: { userName: string; password: string }) {
    const response = await this.api.post('/auth/admin/login', credentials);
    return response.data;
  }

  // User endpoints
  async getAllUsers(params: { page: number; limit: number; search: string; userType?: string; status?: string }) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      search: params.search
    });

    if (params.userType) {
      queryParams.append('userType', params.userType);
    }
    if (params.status) {
      queryParams.append('status', params.status);
    }

    const response = await this.api.get(`/users/admin/all?${queryParams.toString()}`);
    return response.data;
  }

  // Investor endpoints
  async getAllInvestors(params: { page: number; limit: number; search: string; investorStatusId?: number; paymentSystem?: string }) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      search: params.search,
      investorStatusId: (params.investorStatusId || 1).toString()
    });

    if (params.paymentSystem) {
      queryParams.append('paymentSystem', params.paymentSystem);
    }

    console.log('Fetching investors with URL:', `/investor/admin/all?${queryParams.toString()}`);
    
    const response = await this.api.get(`/investor/admin/all?${queryParams.toString()}`);
    return response.data;
  }

  // Transaction endpoints - Changed from GET to POST
  async getAllAmounts() {
    const response = await this.api.post('/amount/getAllAmount', {});
    return response.data;
  }

  // Generic API methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  // Set token manually if needed
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remove token
  removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }
}

export const apiService = new ApiService();
export default apiService;