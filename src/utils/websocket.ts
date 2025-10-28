import { buildUrl } from '@/config/chatConfig';

// WebSocket 配置 - 聊天服务端口 8082
const WS_URL = buildUrl.webSocket('/chat');

// 用户信息接口
export interface User {
  id: string;
  username: string;
  avatar?: string;
}

// 消息接口
export interface ChatMessage {
  id?: string;
  user: User;
  content: string;
  timestamp: number;
  roomId?: string;
}

// 聊天室接口
export interface ChatRoom {
  id: string;
  name: string;
  messages: ChatMessage[];
  users?: User[];
  hasMoreMessages?: boolean; // 是否还有更多历史消息
  isLoadingHistory?: boolean; // 是否正在加载历史消息
}

// WebSocket 管理器类
export class ChatWebSocketManager {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: any) => void)[] = [];
  private stateChangeHandlers: (() => void)[] = [];
  
  public isConnected: boolean = false;
  public connectionError: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private shouldReconnect: boolean = true; // 添加重连控制标志
  private reconnectTimer: NodeJS.Timeout | null = null; // 重连定时器

  // 连接WebSocket，userId作为URL参数
  connect(userId?: string): boolean {
    // 重置重连标志，允许连接
    this.shouldReconnect = true;
    
    // 清除之前的重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket is already connecting...');
      return false;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected');
      return true;
    }

    try {
      // 将userId作为URL参数传递给后端
      let wsUrl = WS_URL;
      if (userId) {
        wsUrl += `?uid=${encodeURIComponent(userId)}`;
      } else {
        // 尝试从localStorage获取userId
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          wsUrl += `?uid=${encodeURIComponent(storedUserId)}`;
        } else {
          console.warn('No userId provided for WebSocket connection, aborting');
          return false; // 没有userId时不连接
        }
      }
      
      console.log('Connecting to WebSocket:', wsUrl.replace(/uid=[^&]*/, 'uid=***'));
      
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      return true;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.connectionError = `连接创建失败: ${error}`;
      this.notifyStateChange();
      return false;
    }
  }

  // 设置事件处理器
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      console.log('WebSocket connected:', event);
      this.isConnected = true;
      this.connectionError = null;
      this.reconnectAttempts = 0;
      this.notifyStateChange();

      // 发送hello消息进行初始化
      this.sendMessage('hello', {});
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        this.notifyMessageHandlers(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error, event.data);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.isConnected = false;
      
      // 只有在允许重连且不是正常关闭时才尝试重连
      if (this.shouldReconnect && event.code !== 1000) {
        this.connectionError = `连接关闭: ${event.reason || '未知原因'} (${event.code})`;
        this.attemptReconnect();
      } else {
        console.log('WebSocket connection closed, reconnection disabled or normal closure');
      }
      
      this.notifyStateChange();
    };

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      this.connectionError = 'WebSocket连接错误';
      this.notifyStateChange();
    };
  }

  // 自动重连
  private attemptReconnect(): void {
    // 检查是否允许重连
    if (!this.shouldReconnect) {
      console.log('Reconnection is disabled, stopping reconnect attempts');
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.connectionError = `连接失败，已重试${this.maxReconnectAttempts}次`;
      return;
    }

    // 检查是否还有有效的userId
    const hasUserId = localStorage.getItem('userId');
    
    if (!hasUserId) {
      console.log('No valid userId found, stopping reconnect attempts');
      this.shouldReconnect = false;
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    // 清除之前的定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }

  // 发送消息 (适配C++后端格式)
  sendMessage(type: string, payload: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return false;
    }

    const message = {
      type,
      payload
    };

    try {
      this.ws.send(JSON.stringify(message));
      console.log('Sent message:', message);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  // 发送聊天消息
  sendChatMessage(roomId: string, content: string): boolean {
    return this.sendMessage('clientMessages', {
      roomId,
      content,
      timestamp: Date.now()
    });
  }

  // 请求历史消息
  requestHistoryMessages(roomId: string, beforeMessageId?: string, limit: number = 20): boolean {
    return this.sendMessage('requestHistory', {
      roomId,
      beforeMessageId, // 在此消息之前的消息
      limit
    });
  }

  // 添加消息处理器
  addMessageHandler(handler: (message: any) => void): void {
    this.messageHandlers.push(handler);
  }

  // 移除消息处理器
  removeMessageHandler(handler: (message: any) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  // 添加状态变化处理器
  addStateChangeHandler(handler: () => void): void {
    this.stateChangeHandlers.push(handler);
  }

  // 移除状态变化处理器
  removeStateChangeHandler(handler: () => void): void {
    const index = this.stateChangeHandlers.indexOf(handler);
    if (index > -1) {
      this.stateChangeHandlers.splice(index, 1);
    }
  }

  // 通知消息处理器
  private notifyMessageHandlers(message: any): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Message handler error:', error);
      }
    });
  }

  // 通知状态变化处理器
  private notifyStateChange(): void {
    this.stateChangeHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        console.error('State change handler error:', error);
      }
    });
  }

  // 断开连接
  disconnect(): void {
    // 停止重连
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.connectionError = null;
    this.reconnectAttempts = 0;
  }

  // 停止重连
  public stopReconnection(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    console.log('WebSocket reconnection stopped');
  }

  // 获取连接状态
  getConnectionState(): string {
    if (!this.ws) return 'CLOSED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }
}

// 全局WebSocket管理器实例
export const chatWebSocketManager = new ChatWebSocketManager();