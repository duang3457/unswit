import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Input, Button, Avatar, Badge, Typography, Space, Divider, message, Alert } from 'antd';
import { SendOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useChatWebSocket } from '@/hooks/useWebSocket';
import './index.less';

const { TextArea } = Input;
const { Text } = Typography;

// 消息组件
const MessageItem: React.FC<{
  userId: string;
  username: string;
  content: string;
  timestamp?: number;
  currentUserId: string;
  avatar?: string;
}> = ({ userId, username, content, timestamp, currentUserId, avatar }) => {
  const isMe = userId === currentUserId;
  
  const formatTime = (ts?: number) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className={`message-item ${isMe ? 'message-item-me' : 'message-item-other'}`}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        marginBottom: 12
      }}>
        {/* 他人消息：左侧头像 */}
        {!isMe && (
          <Avatar
            src={avatar}
            icon={<UserOutlined />}
            size={32}
            style={{ marginRight: 8 }}
          />
        )}
        
        <div style={{
          maxWidth: '70%',
          padding: '8px 12px',
          borderRadius: 8,
          backgroundColor: isMe ? '#1890ff' : '#f5f5f5',
          color: isMe ? 'white' : 'black',
        }}>
          {!isMe && (
            <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
              {username}
            </div>
          )}
          <div>{content}</div>
          {timestamp && (
            <div style={{ 
              fontSize: 10, 
              color: isMe ? 'rgba(255,255,255,0.8)' : '#999',
              marginTop: 4,
              textAlign: isMe ? 'right' : 'left'
            }}>
              {formatTime(timestamp)}
            </div>
          )}
        </div>
        
        {/* 自己的消息：右侧头像 */}
        {isMe && (
          <Avatar
            src={avatar}
            icon={<UserOutlined />}
            size={32}
            style={{ marginLeft: 8 }}
          />
        )}
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const [messageText, setMessageText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    currentUser,
    chatRooms,
    currentRoomId,
    currentRoom,
    isConnected,
    connectionError,
    loading,
    connect,
    sendMessage,
    setCurrentRoom,
    loadHistoryMessages,
  } = useChatWebSocket();

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [currentRoom?.messages]);

  // 监听滚动事件，实现上拉加载历史消息
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // 当滚动到顶部时加载历史消息
      if (container.scrollTop === 0 && currentRoom && currentRoom.hasMoreMessages && !currentRoom.isLoadingHistory) {
        console.log('Loading history messages for room:', currentRoom.id);
        loadHistoryMessages(currentRoom.id);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentRoom, loadHistoryMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 发送消息处理
  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !currentRoomId || !isConnected) {
      if (!isConnected) {
        message.warning('WebSocket未连接，请检查Token设置');
      }
      return;
    }

    const success = sendMessage(currentRoomId, messageText.trim());
    if (success) {
      setMessageText('');
    } else {
      message.error('发送消息失败');
    }
  }, [messageText, currentRoomId, isConnected, sendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTokenSet = (token: string) => {
    connect(token);
  };

  const handleReconnect = () => {
    const token = localStorage.getItem('token');
    if (token) {
      connect(token);
    } else {
      message.warning('请先设置Token');
    }
  };

  // 房间切换处理
  const handleRoomClick = useCallback((roomId: string) => {
    setCurrentRoom(roomId);
  }, [setCurrentRoom]);

  // 渲染加载状态
  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Text>正在连接聊天服务器...</Text>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: '在线聊天',
        breadcrumb: {},
      }}
    >
      <div className="chat-container">

        {/* 连接状态提示 */}
        {connectionError && (
          <Alert
            message="连接失败"
            description={connectionError}
            type="error"
            action={
              <Button size="small" onClick={handleReconnect} icon={<ReloadOutlined />}>
                重新连接
              </Button>
            }
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        <Row gutter={16} style={{ height: 'calc(100vh - 280px)' }}>
          {/* 左侧聊天列表 */}
          <Col span={6}>
            <Card
              title={
                <Space>
                  <span>聊天室</span>
                  <Badge 
                    status={isConnected ? "success" : "error"} 
                    text={isConnected ? "已连接" : "未连接"}
                  />
                </Space>
              }
              bodyStyle={{ padding: 0, height: 'calc(100vh - 360px)', overflow: 'auto' }}
            >
              {chatRooms.length > 0 ? (
                <div>
                  {chatRooms.map((room) => {
                    const lastMessage = room.messages.length > 0 
                      ? room.messages[room.messages.length - 1] 
                      : null;
                    const isSelected = room.id === currentRoomId;

                    return (
                      <div
                        key={room.id}
                        className={`room-item ${isSelected ? 'room-item-selected' : ''}`}
                        onClick={() => handleRoomClick(room.id)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
                          borderLeft: isSelected ? '3px solid #1890ff' : '3px solid transparent'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                          <Avatar size={40} style={{ marginRight: 12, backgroundColor: '#1890ff' }}>
                            {room.name.charAt(0)}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>{room.name}</div>
                            {lastMessage && (
                              <div style={{ 
                                color: '#999', 
                                fontSize: 12, 
                                marginTop: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {lastMessage.content}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: 16, textAlign: 'center' }}>
                  <Text type="secondary">
                    {isConnected ? '暂无聊天室' : '请先连接WebSocket'}
                  </Text>
                </div>
              )}
            </Card>
          </Col>

          {/* 中间聊天窗口 */}
          <Col span={18}>
            {currentRoom ? (
              <Card
                title={
                  <Space>
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      {currentRoom.name.charAt(0)}
                    </Avatar>
                    <span>{currentRoom.name}</span>
                  </Space>
                }
                bodyStyle={{ padding: 0, height: 'calc(100vh - 360px)', display: 'flex', flexDirection: 'column' }}
              >
                {/* 消息区域 */}
                <div 
                  ref={messagesContainerRef}
                  className="messages-container"
                  style={{
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto',
                    backgroundColor: '#fafafa'
                  }}
                >
                  {/* 历史消息加载提示 */}
                  {currentRoom.isLoadingHistory && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#999' }}>
                      <ReloadOutlined spin /> 正在加载历史消息...
                    </div>
                  )}
                  
                  {/* 没有更多历史消息提示 */}
                  {!currentRoom.hasMoreMessages && currentRoom.messages.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#999', fontSize: '12px' }}>
                      没有更多历史消息了
                    </div>
                  )}

                  {currentRoom.messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#999', padding: 50 }}>
                      暂无消息，开始聊天吧！
                    </div>
                  ) : (
                    currentRoom.messages.map((msg, index) => (
                      <MessageItem
                        key={msg.id || `msg-${index}`}
                        userId={msg.user.id}
                        username={msg.user.username}
                        content={msg.content}
                        timestamp={msg.timestamp}
                        currentUserId={currentUser?.id || "0"}
                        avatar={msg.user.avatar}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <Divider style={{ margin: 0 }} />

                {/* 输入区域 */}
                <div style={{ padding: 16 }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <TextArea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isConnected ? "输入消息..." : "请先连接WebSocket"}
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      style={{ resize: 'none' }}
                      disabled={!isConnected}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || !isConnected}
                    >
                      发送
                    </Button>
                  </Space.Compact>
                  {currentUser && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                      当前用户: {currentUser.username} | 房间: {currentRoom.name}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card style={{ height: 'calc(100vh - 360px)' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  flexDirection: 'column',
                  color: '#999'
                }}>
                  <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <Text type="secondary">
                    {isConnected ? '请选择一个聊天室开始对话' : '请先设置Token并连接WebSocket'}
                  </Text>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default Chat;