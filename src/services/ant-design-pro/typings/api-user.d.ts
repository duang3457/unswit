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
    phoneCN: string;
    phoneAU: string;
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

  type UserUpdateInfo = {
    userAccount: string;
    userName?: string;
    email?: string;
    phoneCN?: string;
    phoneAU?: string;
  };

  type UserNotification = {
    emailNotify: boolean;
    smsNotify: boolean;
    pushNotify: boolean;
  };

  // 个人中心页面api
  type UserStats = {
    noteCount: number;
    postCount: number;
    noteLikeCount: number;
    postLikeCount: number;
  };

  type PagedResult<T> = {
    data: T[];
    total: number;
  };

  type MyActivity = {
    id: number;
    title: string;
    start: string;
    updatedAt: string;
    description: string;
  };

  type MyNote = {
    id: number;
    title: string;
    href: string;
    description: string;
    updateTime: string;
  };

  type MyPost = {
    id: number;
    title: string;
    href: string;
    description: string;
    updateTime: string;
  };
}
