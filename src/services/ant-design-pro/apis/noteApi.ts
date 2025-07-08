// @ts-ignore
/* eslint-disable */
import request from '@/plugins/globalRequest';

// 注意有全局响应拦截器，将BaseResponse转换为data, 因此所有请求返回的都是data， 而不是BaseResponse
/** 获取当前的笔记 GET /api/course */
export async function currentNotes(options?: { [key: string]: any }) {
  return request<Record<string, API.CategoryCourse>>('/api/course', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 添加笔记 POST /api/note/add */
export async function addNote(options?: { [key: string]: any }) {
  return request<API.CategoryCourse[]>('/api/note/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 批量获取点赞状态 POST /api/notes/likes */
export async function fetchNoteLikes(options?: { [key: string]: any }) {
  return request<API.LikesResponse>('/api/note/likes', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 切换点赞 POST /api/notes/like */
export async function toggleNoteLike(
  noteId: number,
  userId?: string,
  options?: { [key: string]: any },
) {
  return request<{ liked: boolean; likes: number }>('/api/note/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { noteId, userId },
    ...(options || {}),
  });
}
