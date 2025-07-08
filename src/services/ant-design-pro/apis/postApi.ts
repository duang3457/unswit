// @ts-ignore
/* eslint-disable */
import request from '@/plugins/globalRequest';

// 注意有全局响应拦截器，将BaseResponse转换为data, 因此所有请求返回的都是data， 而不是BaseResponse
/** 批量获取点赞状态 POST /api/post/likes */
export async function fetchPostLikes(options?: { [key: string]: any }) {
  return request<API.LikesResponse>('/api/posts/likes', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 切换点赞 POST /api/posts/like */
export async function togglePostLike(
  postId: number,
  userId: string,
  options?: { [key: string]: any },
) {
  return request<{ liked: boolean; likes: number }>('/api/posts/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { postId, userId },
    ...(options || {}),
  });
}

/** 获取帖子列表 GET /api/posts */
export async function fetchPosts(
  page: number,
  pageSize: number = 5,
  options?: { [key: string]: any },
) {
  return request<API.PostList>('/api/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { page, pageSize }, // 分页参数放在url中
    ...(options || {}),
  });
}

/** 获取帖子详情 GET /api/posts/:id */
export async function fetchPostDetail(id: number, options?: { [key: string]: any }) {
  return request<API.PostComment>(`/api/posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 创建新帖子 POST /api/posts */
export async function createPost(body: API.CreatePostParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>('/api/posts/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建评论 POST /api/comments */
export async function createComment(
  body: API.CreateCommentParams,
  options?: { [key: string]: any },
) {
  return request<API.CommentResponse>('/api/comments/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      postId: body.postId,
      parentId: body.parentId || 0,
      content: body.content,
    },
    ...(options || {}),
  });
}
