export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  encryptedPassword: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
  encrypted_password: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface UpdatePasswordRequest {
  password: string;
  passwordConfirmation: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
}

export interface DeleteAccountResponse {
  success: boolean;
}

export interface SubscriptionConfirmRequest {
  token: string;
}

export interface SubscriptionConfirmResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: import('./models').User;
}