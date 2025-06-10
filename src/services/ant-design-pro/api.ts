// @ts-ignore
/* eslint-disable */
import request from '@/plugins/globalRequest';

// 注意有全局响应拦截器，将BaseResponse转换为data, 因此所有请求返回的都是data， 而不是BaseResponse
/** 获取当前的用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>(
    '/api/user/current', 
    {
      method: 'GET',
      credentials: 'include', // 确保携带cookie
      ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>(
    '/api/user/logout', 
    {
      method: 'POST',
      ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
// token在请求头，不需要显示接受，正常data部分是string："ok"
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<String>(
    '/api/user/login', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
  });
}

/** 注册接口 POST /api/user/register */
export async function register(
  body: API.RegisterParams, 
  options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RegisterResult>>(
    '/api/user/register', 
    {
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
  return request<API.BaseResponse<API.CurrentUser[]>>(
    '/api/user/search', 
    {
      method: 'GET',
      ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取当前的笔记 GET /api/course */
export async function currentNotes(
  options?: { [key: string]: any }) {
  return request<Record<string, API.CategoryCourse>>(
    '/api/course', 
    {
      method: 'POST',
      ...(options || {}),
  });
}

/** 添加笔记 POST /api/note/add */
export async function addNote(options?: { [key: string]: any }) {
  return request<API.CategoryCourse[]>(
    '/api/note/add', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || {}),
  });
}


/** 批量获取点赞状态 POST /api/notes/likes */
export async function fetchNoteLikes(
  options?: { [key: string]: any },
) {
  return request<API.LikesResponse>(
    '/api/note/likes',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** 切换点赞 POST /api/notes/like */
export async function toggleNoteLike(
  noteId: number,
  userId?: string, 
  options?: { [key: string]: any },
) {
  return request<{ liked: boolean; likes: number }>(
    '/api/note/like',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { noteId, userId },
      ...(options || {}),
    },
  );
}
