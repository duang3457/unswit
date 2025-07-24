// @ts-ignore
/* eslint-disable */

declare namespace API {
  // 后端变化之后，最好同步一下这个，虽然不更新也没事
  type PostComment = {
    post: Post; // 帖子
    comments: Comment[]; // 评论列表
  };

  type Comment = {
    id: number; // 评论ID
    authorId: string; // 评论作者ID
    postId: number; // 评论所属帖子ID
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

  interface CommentTree extends Comment {
    /** 子评论列表（如果有） */
    children: CommentTree[];
  }

  type Post = {
    id: number;
    author: string; // 作者名称
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
    postId: number; // 帖子ID
    content: string; // 评论内容
    parentId?: number; // 父评论ID（回复评论时使用）
  };

  type CommentResponse = {
    success: boolean;
    errorMsg: string;
    data: any; // 评论数据
    total: number;
  };

  type PostList = {
    postSumList: PostSummary[];
    total: number; // 总数
    pageSize?: number; // 每页数量
    page?: number; // 当前页码
  };

  // 与Post不同的是，content是内容摘要
  type PostSummary = {
    id: number;
    title: string;
    content: string; // 内容摘要（前50个字符+...）
    author: string;
    authorAvatar?: string; // 作者头像
    likeCount: number;
    commentCount: number;
    updateTime: string;
  };

  type LikesResponse = {
    likes: Record<number, number>; // {ID1: 点赞数,ID2: 点赞数, ...}
    likedByUser: Record<number, boolean>; // {ID1: 是否点赞, ID2: 是否点赞, ...} UserID作为参数，拿到这条返回值
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };
}
