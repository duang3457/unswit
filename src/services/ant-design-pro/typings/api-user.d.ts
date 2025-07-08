// @ts-ignore
/* eslint-disable */

declare namespace API {
  // 接口返回safetyUser
  type CurrentUser = {
    id: string;
    userName: string;
    userAccount: string;
    avatarUrl?: string;
    gender: number;
    phone: string;
    email: string;
    userStatus: number;
    userRole: number;
    createTime: Date;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type RegisterResult = number;

  type LoginParams = {
    userAccount?: string;
    userPassword?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type RegisterParams = {
    userName?: string;
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
    type?: string;
  };
}
