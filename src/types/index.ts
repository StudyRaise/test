export type Gender = '男' | '女';
export type TimeSlot = '上午' | '下午';
export type CheckItem = '胃镜' | '肠镜' | '胃镜+肠镜';

export interface AppointmentForm {
  name: string;
  gender: Gender;
  phone: string;
  date: string;
  timeSlot: TimeSlot;
  item: CheckItem;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应数据
export interface LoginResult {
  token: string;
  userInfo: {
    id: number;
    name: string;
    avatar?: string;
  };
}

// 通用API响应结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
