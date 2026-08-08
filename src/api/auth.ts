import { noAuthClient, webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { LoginRequest, RegisterRequest, LoginResponse, UserInfo, ApiResponse } from '../types/api';

export const authApi = {
  login: (data: LoginRequest) =>
    noAuthClient.post<ApiResponse<LoginResponse>>(API_PATHS.LOGIN, data).then(r => r.data),

  register: (data: RegisterRequest) =>
    noAuthClient.post<ApiResponse<LoginResponse>>(API_PATHS.REGISTER, data).then(r => r.data),

  sendCode: (account: string, scene: string, type: 'sms' | 'email') =>
    noAuthClient.post(API_PATHS.SEND_CODE, { account, scene, type }).then(r => r.data),

  resetPassword: (account: string, code: string, newPassword: string) =>
    noAuthClient.post(API_PATHS.RESET_PASSWORD, { account, code, new_password: newPassword }).then(r => r.data),

  logout: () =>
    webApiClient.post(API_PATHS.LOGOUT).then(r => r.data),

  getMe: () =>
    webApiClient.get<ApiResponse<UserInfo>>(API_PATHS.ME).then(r => r.data),

  updateProfile: (data: Partial<{ name: string; avatar_url: string }>) =>
    webApiClient.put(API_PATHS.ME, data).then(r => r.data),
};
