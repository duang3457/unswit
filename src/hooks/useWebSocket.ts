import { useState, useEffect, useCallback } from 'react';
import { chatWebSocketManager, User, ChatRoom, ChatMessage } from '@/utils/websocket';

export interface UseChatWebSocketReturn {
  // 状态
  currentUser: User | null;
  chatRooms: ChatRoom[];
  currentRoomId: string | null;
  currentRoom: ChatRoom | null;
  isConnected: boolean;
  connectionError: string | null;
  loading: boolean;

  // 操作
  connect: (userId?: string) => boolean;
  disconnect: () => void;
  sendMessage: (roomId: string, content: string) => boolean;
  setCurrentRoom: (roomId: string) => void;
  loadHistoryMessages: (roomId: string) => void;
}

export const useChatWebSocket = (): UseChatWebSocketReturn => {
  // 基础状态
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 计算当前房间
  const currentRoom = chatRooms.find(room => room.id === currentRoomId) || null;

  // 处理WebSocket消息
  const handleMessage = useCallback((message: any) => {
    console.log('Processing message:', message);
    
    switch (message.type) {
      case 'hello':
        // 处理初始化消息
        if (message.payload.user) {
          setCurrentUser(message.payload.user);
        }
        if (message.payload.rooms) {
          // 为每个房间设置初始分页状态
          const roomsWithPagination = (message.payload.rooms || []).map((room: ChatRoom) => ({
            ...room,
            hasMoreMessages: true, // 初始假设有更多消息
            isLoadingHistory: false
          }));
          setChatRooms(roomsWithPagination);
        }
        setLoading(false);
        break;

      case 'serverMessages':
        // 处理服务器消息（新消息到达）
        console.log("新消息到达serverMessages")
        const msgData = message.payload;
        console.log("serverMessages:", msgData);
        if (msgData && msgData.room_id) {
          // 构造ChatMessage对象
          const chatMessage: ChatMessage = {
            id: msgData.id,
            user: msgData.user,
            content: msgData.content,
            timestamp: msgData.timestamp,
            roomId: msgData.room_id
          };

          setChatRooms(prevRooms => 
            prevRooms.map(room => {
              if (room.id === msgData.room_id) {
                // 检查消息是否已存在，避免重复
                const existingMessageIds = room.messages.map(msg => msg.id || '');
                if (!existingMessageIds.includes(msgData.id)) {
                  return {
                    ...room,
                    messages: [...room.messages, chatMessage]
                  };
                }
              }
              return room;
            })
          );
        }
        break;

      case 'historyMessages':
        // 处理历史消息响应
        const { roomId: historyRoomId, messages: historyMessages, hasMore } = message.payload;
        if (historyRoomId && historyMessages) {
          setChatRooms(prevRooms => 
            prevRooms.map(room => {
              if (room.id === historyRoomId) {
                // 将历史消息添加到现有消息前面，避免重复
                const existingMessageIds = room.messages.map(msg => msg.id || '');
                const newHistoryMessages = historyMessages.filter((msg: ChatMessage) => 
                  !existingMessageIds.includes(msg.id || '')
                );
                return {
                  ...room,
                  messages: [...newHistoryMessages, ...room.messages],
                  hasMoreMessages: hasMore,
                  isLoadingHistory: false
                };
              }
              return room;
            })
          );
        }
        break;

      case 'error':
        console.error('Server error:', message.payload);
        setConnectionError(message.payload.message || '服务器错误');
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  // 处理连接状态变化
  const handleStateChange = useCallback(() => {
    setIsConnected(chatWebSocketManager.isConnected);
    setConnectionError(chatWebSocketManager.connectionError);
  }, []);

  // 连接WebSocket
  const connect = useCallback((userId?: string) => {
    setLoading(true);
    const success = chatWebSocketManager.connect(userId);
    if (!success) {
      setLoading(false);
    }
    return success;
  }, []);

  // 断开连接
  const disconnect = useCallback(() => {
    chatWebSocketManager.disconnect();
  }, []);

  // 发送消息
  const sendMessage = useCallback((roomId: string, content: string) => {
    if (!currentUser) {
      console.error('No current user, cannot send message');
      return false;
    }

    const success = chatWebSocketManager.sendChatMessage(roomId, content);
    
    if (success) {
      // 本地先添加消息（乐观更新）
      const newMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        user: currentUser,
        content,
        timestamp: Date.now(),
        roomId
      };

      setChatRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              messages: [...room.messages, newMessage]
            };
          }
          return room;
        })
      );
    }
    
    return success;
  }, [currentUser]);

  // 设置当前房间
  const setCurrentRoom = useCallback((roomId: string) => {
    setCurrentRoomId(roomId);
  }, []);

  // 加载历史消息
  const loadHistoryMessages = useCallback((roomId: string) => {
    const room = chatRooms.find(r => r.id === roomId);
    if (!room || room.isLoadingHistory || !room.hasMoreMessages) {
      return; // 房间不存在、正在加载或没有更多消息
    }

    // 设置加载状态
    setChatRooms(prevRooms => 
      prevRooms.map(r => 
        r.id === roomId 
          ? { ...r, isLoadingHistory: true }
          : r
      )
    );

    // 获取最早的消息ID作为分页参数
    const earliestMessage = room.messages[0];
    const beforeMessageId = earliestMessage?.id;

    // 发送历史消息请求
    const success = chatWebSocketManager.requestHistoryMessages(roomId, beforeMessageId);
    if (!success) {
      // 如果发送失败，重置加载状态
      setChatRooms(prevRooms => 
        prevRooms.map(r => 
          r.id === roomId 
            ? { ...r, isLoadingHistory: false }
            : r
        )
      );
    }
  }, [chatRooms]);

  // 组件挂载时设置事件监听器
  useEffect(() => {
    chatWebSocketManager.addMessageHandler(handleMessage);
    chatWebSocketManager.addStateChangeHandler(handleStateChange);

    // 初始状态同步
    handleStateChange();

    // 如果已连接，发送hello消息获取初始数据
    if (chatWebSocketManager.isConnected) {
      chatWebSocketManager.sendMessage('hello', {});
    }

    return () => {
      chatWebSocketManager.removeMessageHandler(handleMessage);
      chatWebSocketManager.removeStateChangeHandler(handleStateChange);
    };
  }, [handleMessage, handleStateChange]);

  // 自动连接（如果有userId）
  useEffect(() => {
    if (!isConnected && !loading && !connectionError) {
      const userId = localStorage.getItem('userId');
      
      if (userId) {
        console.log('Auto-connecting with stored userId:', userId);
        connect(userId);
      }
    }
  }, [isConnected, loading, connectionError, connect]);

  return {
    // 状态
    currentUser,
    chatRooms,
    currentRoomId,
    currentRoom,
    isConnected,
    connectionError,
    loading,

    // 操作
    connect,
    disconnect,
    sendMessage,
    setCurrentRoom,
    loadHistoryMessages,
  };
};