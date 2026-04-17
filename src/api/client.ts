import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiError } from '../types';

const TOKEN_KEY = 'auth_token';
const CORRELATION_ID_KEY = 'correlation_id';

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private correlationId: string | null = null;

  constructor(baseURL: string = 'https://your-api.com/api') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      if (this.correlationId) {
        config.headers['x-correlation-id'] = this.correlationId;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.removeAuthToken();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  async setAuthToken(token: string): Promise<void> {
    this.authToken = token;
    this.correlationId = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async removeAuthToken(): Promise<void> {
    this.authToken = null;
    this.correlationId = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  async loadAuthToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      this.authToken = token;
      this.correlationId = token;
    }
    return token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  setBaseURL(url: string): void {
    this.client.defaults.baseURL = url;
  }

  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  private parseError(error: AxiosError): ApiError {
    const responseData = error.response?.data as Record<string, unknown>;
    return {
      message: (responseData?.message as string) || error.message || 'An error occurred',
      status: error.response?.status || 500,
      errors: responseData?.errors as Record<string, string[]> | undefined,
    };
  }
}

export const apiClient = new ApiClient();
export default apiClient;