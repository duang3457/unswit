// @ts-ignore
/* eslint-disable */

declare namespace API {
  // 后端变化之后，最好同步一下这个，虽然不更新也没事
  type Course = {
    courseId: number;
    code: string; // 课程代码
    title: string; // 课程标题
    category: number; // 课程分类
    toolTip?: string; // 课程描述
    enrollTime?: number; // 课程可以注册的时间
    noteList?: Note[]; // 课程笔记列表
  }

  type Note = {
    id: number;
    courseId: number; // 课程ID
    title?: string;
    link?: string;
    author?: string; // 作者
    lecturer?: string; // 讲师
    toolTip?: string; // 笔记描述
    // views?: number; // 浏览量
    // likes?: number; // 点赞数
    // comments?: number; // 评论数
  };


  type CurrentUser = {
    id: number;
    userName: string;
    userAccount: string;
    avatarUrl?: string;
    gender:number;
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

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  /**
   * 通用返回类
   */
  type BaseResponse<T> = {
    code: number,
    data: T,
    message: string,
    description: string,
  }

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

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

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
