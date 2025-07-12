// @ts-ignore
/* eslint-disable */

declare namespace API {
  // 后端变化之后，最好同步一下这个，虽然不更新也没事
  type BlogComment = {
    blog: Blog; // 帖子
    comments: Comment[]; // 评论列表
  };

  type Comment = {
    id: number; // 评论ID
    authorId: number; // 评论作者ID
    blogId: number; // 评论所属帖子ID
    authorName: string; // 评论作者名称
    authorAvatar?: string; // 评论作者头像
    content: string; // 评论内容
    createTime: string; // 创建时间
    updateTime?: string; // 更新时间
    likeCount?: number; // 点赞数
    replyCount?: number; // 回复数
    children?: Comment[]; // 回复列表（如果有）
    parentId?: number; // 父评论ID（如果是回复评论）
  };

  type Blog = {
    id: number;
    authorName: string; // 作者名称
    title: string;
    images?: string[]; // 帖子图片列表(url)
    content: string; // 帖子内容
    likeCount: number; // 点赞数
    commentCount: number; // 评论数
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
  };

  type CreatePostParams = {
    title: string; // 帖子标题
    content: string; // 帖子内容
  };

  type CreateCommentParams = {
    blogId: number; // 帖子ID
    content: string; // 评论内容
    parentId?: number; // 父评论ID（回复评论时使用）
  };

  type CommentResponse = {
    success: boolean;
    errorMsg: string;
    data: any; // 评论数据
    total: number;
  };

  type BlogList = {
    blogSumList: BlogSummary[];
    total: number; // 总数
    pageSize?: number; // 每页数量
    page?: number; // 当前页码
  };

  type BlogSummary = {
    id: number;
    title: string;
    content: string; // 内容摘要（前50个字符+...）
    author: string;
    updateTime: string;
  };

  type LikesResponse = {
    likes: Record<number, number>; // {ID1: 点赞数,ID2: 点赞数, ...}
    likedByUser: Record<number, boolean>; // {ID1: 是否点赞, ID2: 是否点赞, ...} UserID作为参数，拿到这条返回值
  };

  type CategoryCourse = {
    categoryTitle: string; // 分类标题
    toolTip?: string; // 分类描述
    subTitle?: string; // 分类副标题
    courseNotes: CourseNote[]; // 课程笔记列表
  };

  type CourseNote = {
    courseId: number;
    code: string; // 课程代码
    title: string; // 课程标题
    category: number; // 课程分类
    toolTip?: string; // 课程描述
    enrollTime?: number; // 课程可以注册的时间
    noteList?: Note[]; // 课程笔记列表
  };

  type Note = {
    id: number; // 笔记ID
    courseId: number; // 课程ID
    title?: string;
    link?: string;
    author?: string; // 作者
    lecturer?: string; // 讲师
    toolTip?: string; // 笔记描述
    // views?: number; // 浏览量
    likes?: number; // 点赞数
    // comments?: number; // 评论数
    createTime?: Date; // 创建时间
    updateTime?: Date; // 更新时间
  };

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
    code: number;
    data: T;
    message: string;
    description: string;
  };

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
