import request from '@/utils/request';
import type { LoginParams, LoginResult } from '@/types';

enum Api {
  Login = '/auth/login',
  UserInfo = '/auth/user-info',
  Logout = '/auth/logout'
}

/**
 * 用户登录
 * @param data 登录参数 { username, password }
 * @returns Promise<LoginResult>
 */
export const login = (data: LoginParams) => {
  return request.post<LoginResult>(Api.Login, data);
};

/**
 * 获取用户信息
 * @returns Promise<UserInfo>
 */
export const getUserInfo = () => {
  return request.get<LoginResult['userInfo']>(Api.UserInfo);
};

/**
 * 退出登录
 */
export const logout = () => {
  return request.post<void>(Api.Logout);
};
