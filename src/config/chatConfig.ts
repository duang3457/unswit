/**
 * 聊天系统配置文件
 * 集中管理所有聊天相关的服务端口和URL配置
 */

// 环境配置
const isDev = process.env.NODE_ENV === 'development';

// 服务端口配置
export const CHAT_CONFIG = {
  // 主要业务服务端口（用户登录、注册等）
  MAIN_SERVER_PORT: 8080,
  
  // 聊天服务端口（WebSocket、聊天API等）
  CHAT_SERVER_PORT: 8082,
  
  // 服务器主机
  HOST: 'localhost',
  
  // 协议配置
  HTTP_PROTOCOL: isDev ? 'http' : 'https',
  WS_PROTOCOL: isDev ? 'ws' : 'wss',
};

// URL 构建器
export const buildUrl = {
  // 主要业务API URL
  mainApi: (path: string) => `${CHAT_CONFIG.HTTP_PROTOCOL}://${CHAT_CONFIG.HOST}:${CHAT_CONFIG.MAIN_SERVER_PORT}${path}`,
  
  // 聊天API URL
  chatApi: (path: string) => `${CHAT_CONFIG.HTTP_PROTOCOL}://${CHAT_CONFIG.HOST}:${CHAT_CONFIG.CHAT_SERVER_PORT}${path}`,
  
  // WebSocket URL
  webSocket: (path: string = '/chat') => `${CHAT_CONFIG.WS_PROTOCOL}://${CHAT_CONFIG.HOST}:${CHAT_CONFIG.CHAT_SERVER_PORT}${path}`,
};

// 服务端点
export const ENDPOINTS = {
  // 主要业务端点
  MAIN_SERVER: `${CHAT_CONFIG.HTTP_PROTOCOL}://${CHAT_CONFIG.HOST}:${CHAT_CONFIG.MAIN_SERVER_PORT}`,
  
  // 聊天服务端点
  CHAT_SERVER: `${CHAT_CONFIG.HTTP_PROTOCOL}://${CHAT_CONFIG.HOST}:${CHAT_CONFIG.CHAT_SERVER_PORT}`,
  
  // WebSocket端点
  WEBSOCKET_SERVER: `${CHAT_CONFIG.WS_PROTOCOL}://${CHAT_CONFIG.HOST}:${CHAT_CONFIG.CHAT_SERVER_PORT}`,
};

// API 路径
export const API_PATHS = {
  // 聊天相关API路径
  CHAT: {
    ROOMS: '/api/chat/rooms',
    MESSAGES: '/api/chat/messages',
    USER: '/api/chat/user',
    PING: '/api/chat/ping',
  },
  
  // 主要业务API路径
  MAIN: {
    LOGIN: '/api/user/login',
    LOGOUT: '/api/user/logout',
    REGISTER: '/api/user/register',
    CURRENT_USER: '/api/user/current',
  },
};

// 请求识别函数
export const isChatRequest = (url: string): boolean => {
  return url.includes('/api/chat/') || 
         url.includes(':8082') || 
         url.startsWith(ENDPOINTS.CHAT_SERVER);
};

export const isMainRequest = (url: string): boolean => {
  return url.includes('/api/user/') || 
         url.includes('/api/notes/') || 
         url.includes('/api/posts/') ||
         url.includes(':8080') ||
         url.startsWith(ENDPOINTS.MAIN_SERVER);
};

// 默认导出配置
export default {
  ...CHAT_CONFIG,
  buildUrl,
  ENDPOINTS,
  API_PATHS,
  isChatRequest,
  isMainRequest,
};