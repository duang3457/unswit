// @ts-ignore
/* eslint-disable */
import request from '@/plugins/globalRequest';

// 注意有全局响应拦截器，将BaseResponse转换为data, 因此所有请求返回的都是data， 而不是BaseResponse
/** 获取当前的用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/user/current', {
    method: 'GET',
    credentials: 'include', // 确保携带cookie
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
// token在请求头，不需要显示接受，正常data部分是string："ok"
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<String>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RegisterResult>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 搜索用户 GET /api/user/search */
export async function searchUsers(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser[]>>('/api/user/search', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新用户基本信息 PUT /api/user/basic */
export async function updateUserBasicInfo(
  body: API.UserUpdateInfo,
  options?: { [key: string]: any },
) {
  return request<API.CurrentUser>('/api/user/basic', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    credentials: 'include',
    ...(options || {}),
  });
}

/** 修改用户密码 POST /api/user/password */
export async function changeUserPassword(
  body: { oldPassword: string; newPassword: string },
  options?: { [key: string]: any },
) {
  return request<string>('/api/user/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    credentials: 'include',
    ...(options || {}),
  });
}

/** 获取用户的统计数据 GET /api/user/stats */
export async function getUserStats(options?: { [key: string]: any }): Promise<API.UserStats> {
  return request<API.UserStats>('/api/user/stats', {
    method: 'GET',
    credentials: 'include',
    ...(options || {}),
  });
}

/** 拉取“动态”列表（分页） GET /api/user/activities */
export async function fetchActivities(
  params: { current?: number; pageSize?: number },
  options?: { [key: string]: any },
): Promise<API.PagedResult<API.MyActivity>> {
  const resp = await request<{
    items: API.MyActivity[];
    total: number;
  }>('/api/user/activities', {
    method: 'GET',
    params,
    credentials: 'include',
    ...(options || {}),
  });
  return {
    data: resp.items,
    total: resp.total,
  };
}

/** 拉取“我的笔记”列表（分页） GET /api/user/notes */
export async function fetchNotes(
  params: { current?: number; pageSize?: number },
  options?: { [key: string]: any },
): Promise<API.PagedResult<API.MyNote>> {
  const resp = await request<{
    data: API.MyNote[];
    total: number;
  }>('/api/user/notes', {
    method: 'GET',
    params,
    credentials: 'include',
    ...(options || {}),
  });
  return {
    data: resp.data,
    total: resp.total,
  };
}

/** 拉取“我的帖子”列表（分页） GET /api/user/posts */
export async function fetchPosts(
  params: { current?: number; pageSize?: number },
  options?: { [key: string]: any },
): Promise<API.PagedResult<API.MyPost>> {
  const resp = await request<{
    data: API.MyPost[];
    total: number;
  }>('/api/user/posts', {
    method: 'GET',
    params,
    credentials: 'include',
    ...(options || {}),
  });
  return {
    data: resp.data,
    total: resp.total,
  };
}
/** 删除笔记 DELETE /api/user/notes/:id */
export async function deleteNote(
  noteId: number,
  options?: { [key: string]: any },
): Promise<API.BaseResponse<number>> {
  return request<API.BaseResponse<number>>(`/api/note/${noteId}`, {
    method: 'DELETE',
    credentials: 'include',
    ...(options || {}),
  });
}
/** 删除帖子 DELETE /api/user/posts/:id */
export async function deletePost(
  postId: number,
  options?: { [key: string]: any },
): Promise<API.BaseResponse<number>> {
  return request<API.BaseResponse<number>>(`/api/posts/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
    ...(options || {}),
  });
}
