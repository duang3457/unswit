/**
 * 聊天系统专用请求工具
 * 所有聊天相关的HTTP请求都发送到 8082 端口
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { ENDPOINTS } from '@/config/chatConfig';

// 聊天服务器配置
const CHAT_SERVER_BASE_URL = ENDPOINTS.CHAT_SERVER;

/**
 * 聊天系统专用request实例
 */
const chatRequest = extend({
  prefix: CHAT_SERVER_BASE_URL,
  credentials: 'include',
  timeout: 10000,
});

/**
 * 聊天请求拦截器
 */
chatRequest.interceptors.request.use((url, options): any => {
  console.log(`Chat request url = ${CHAT_SERVER_BASE_URL}${url}`);

  // 添加认证token到请求头
  const token = localStorage.getItem('token');
  const headers: any = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers['X-Chat-Token'] = token;
  }

  return {
    url,
    options: {
      ...options,
      headers,
    },
  };
});

/**
 * 聊天响应拦截器
 */
chatRequest.interceptors.response.use(async (response): Promise<any> => {
  try {
    const res = await response.clone().json();

    if (res.code === 0 || res.success === true) {
      return res.data || res;
    } else if (res.code === 1) {
      message.success(res.message || res.description);
      return res.data || res;
    } else if (res.code === 401 || res.code === 40100) {
      message.error('聊天认证失败，请重新登录');
      localStorage.removeItem('token');
      return Promise.reject(new Error('Authentication failed'));
    } else {
      message.error(res.message || res.description || '聊天服务请求失败');
      return Promise.reject(new Error(res.message || 'Chat request failed'));
    }
  } catch (error) {
    console.error('Chat request error:', error);
    message.error('聊天服务连接失败');
    return Promise.reject(error);
  }
});

/**
 * 聊天相关API接口
 */
export const chatApi = {
  // 获取聊天室列表
  getChatRooms: (options?: Record<string, any>) => {
    return chatRequest<any[]>('/api/chat/rooms', {
      method: 'GET',
      ...(options || {}),
    });
  },

  // 获取聊天室历史消息
  getRoomMessages: (roomId: string, options?: Record<string, any>) => {
    return chatRequest<any[]>(`/api/chat/rooms/${roomId}/messages`, {
      method: 'GET',
      ...(options || {}),
    });
  },

  // 发送消息
  sendMessage: (roomId: string, content: string, options?: Record<string, any>) => {
    return chatRequest<any>('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        roomId,
        content,
        timestamp: Date.now(),
      },
      ...(options || {}),
    });
  },

  // 获取用户信息
  getUserInfo: (options?: Record<string, any>) => {
    return chatRequest<any>('/api/chat/user', {
      method: 'GET',
      ...(options || {}),
    });
  },

  // 创建聊天室
  createRoom: (name: string, description?: string, options?: Record<string, any>) => {
    return chatRequest<any>('/api/chat/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name,
        description,
      },
      ...(options || {}),
    });
  },

  // 加入聊天室
  joinRoom: (roomId: string, options?: Record<string, any>) => {
    return chatRequest<any>(`/api/chat/rooms/${roomId}/join`, {
      method: 'POST',
      ...(options || {}),
    });
  },

  // 离开聊天室
  leaveRoom: (roomId: string, options?: Record<string, any>) => {
    return chatRequest<any>(`/api/chat/rooms/${roomId}/leave`, {
      method: 'POST',
      ...(options || {}),
    });
  },

  // 检查连接状态
  checkConnection: (options?: Record<string, any>) => {
    return chatRequest<any>('/api/chat/ping', {
      method: 'GET',
      ...(options || {}),
    });
  },
};

export default chatRequest;
