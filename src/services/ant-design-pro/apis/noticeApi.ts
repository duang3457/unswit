// @ts-ignore
/* eslint-disable */
import request from '@/plugins/globalRequest';

// 注意有全局响应拦截器，将BaseResponse转换为data, 因此所有请求返回的都是data， 而不是BaseResponse
/** 获取通知列表 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeList>('/api/notices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
