/**
 * Token管理工具
 * 用于处理WebSocket聊天系统的认证token
 */

/**
 * 从cookie中提取access_token
 */
const getAccessTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

/**
 * 获取当前存储的token
 * 优先级：localStorage > cookie
 */
export const getStoredToken = (): string | null => {
  // 首先尝试从localStorage获取
  let token = localStorage.getItem('token') || 
              localStorage.getItem('userToken') || 
              localStorage.getItem('authToken');
  
  // 如果localStorage没有，尝试从cookie获取
  if (!token) {
    token = getAccessTokenFromCookie();
    // 如果从cookie获取到token，同步保存到localStorage
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token synced from cookie to localStorage');
    }
  }
  
  return token;
};

/**
 * 保存token到localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
  console.log('Token saved to localStorage');
};

/**
 * 清除所有token
 */
export const clearTokens = (): void => {
  // 清除localStorage中的token
  localStorage.removeItem('token');
  localStorage.removeItem('userToken');
  localStorage.removeItem('authToken');
  
  // 清除cookie中的access_token
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  console.log('All authentication tokens cleared from localStorage and cookies');
};

/**
 * 基于当前用户信息生成临时token
 * 用于在后端没有提供token时的临时方案
 */
export const generateTempToken = (userId: string | number, username?: string): string => {
  const timestamp = Date.now();
  const userInfo = username ? `${userId}_${username}` : userId.toString();
  return `temp_${userInfo}_${timestamp}`;
};

/**
 * 刷新或生成用户token
 * 在登录成功后调用，确保聊天系统有可用的token
 */
export const refreshUserToken = async (userInfo?: { id: string | number; userName?: string }): Promise<string | null> => {
  try {
    // 首先尝试从cookie获取access_token
    const cookieToken = getAccessTokenFromCookie();
    if (cookieToken) {
      saveToken(cookieToken);
      console.log('Token refreshed from cookie:', cookieToken.substring(0, 20) + '***');
      return cookieToken;
    }

    // 然后检查localStorage中是否已有有效token
    const existingToken = getStoredToken();
    if (existingToken) {
      console.log('Using existing token from localStorage');
      return existingToken;
    }

    // 如果没有token且有用户信息，生成临时token
    if (userInfo && userInfo.id) {
      const tempToken = generateTempToken(userInfo.id, userInfo.userName);
      saveToken(tempToken);
      console.log('Generated temporary token for user:', userInfo.id);
      return tempToken;
    }

    console.warn('No token available and no user info provided');
    return null;
  } catch (error) {
    console.error('Error refreshing user token:', error);
    return null;
  }
};

/**
 * 检查token是否有效（基本检查）
 */
export const isTokenValid = (token: string): boolean => {
  if (!token || token.trim().length === 0) {
    return false;
  }
  
  // 基本格式检查
  if (token.length < 10) {
    return false;
  }
  
  // 可以添加更多验证逻辑，比如检查过期时间等
  return true;
};

/**
 * 获取token用于WebSocket连接
 * 返回格式化的token，如果无效则返回null
 */
export const getTokenForWebSocket = (): string | null => {
  const token = getStoredToken();
  
  if (!token) {
    console.warn('No token found for WebSocket connection');
    return null;
  }
  
  if (!isTokenValid(token)) {
    console.warn('Invalid token found, clearing...');
    clearTokens();
    return null;
  }
  
  return token;
};

/**
 * Token管理事件监听器
 * 用于在token变化时通知其他组件
 */
type TokenChangeListener = (token: string | null) => void;

const tokenChangeListeners: TokenChangeListener[] = [];

export const addTokenChangeListener = (listener: TokenChangeListener): void => {
  tokenChangeListeners.push(listener);
};

export const removeTokenChangeListener = (listener: TokenChangeListener): void => {
  const index = tokenChangeListeners.indexOf(listener);
  if (index > -1) {
    tokenChangeListeners.splice(index, 1);
  }
};

const notifyTokenChange = (token: string | null): void => {
  tokenChangeListeners.forEach(listener => {
    try {
      listener(token);
    } catch (error) {
      console.error('Error in token change listener:', error);
    }
  });
};

// 重写saveToken和clearTokens以触发事件
export const saveTokenWithNotification = (token: string): void => {
  saveToken(token);
  notifyTokenChange(token);
};

export const clearTokensWithNotification = (): void => {
  clearTokens();
  notifyTokenChange(null);
};