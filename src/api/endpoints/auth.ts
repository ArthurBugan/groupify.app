import apiClient from '../client';
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  UpdatePasswordRequest,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  UpdatePasswordResponse,
  DeleteAccountResponse,
  User,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/authorize', credentials);
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/registration', credentials);
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return apiClient.post<ForgotPasswordResponse>('/forget-password', data);
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
    return apiClient.post<UpdatePasswordResponse>('/auth/update_password', data);
  },

  deleteAccount: async (): Promise<DeleteAccountResponse> => {
    return apiClient.delete<DeleteAccountResponse>('/account');
  },

  logout: async (): Promise<void> => {
    return apiClient.post<void>('/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/api/v3/me');
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    return apiClient.post<UpdateProfileResponse>('/api/v3/me', data);
  },
};