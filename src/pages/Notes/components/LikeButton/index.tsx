// src/components/LikeButton.tsx

import React, { useState, useEffect } from 'react';
import { Space, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { toggleNoteLike as apiToggleNoteLike } from '@/services/ant-design-pro/apis/noteApi';

export interface LikeButtonProps {
  userId?: string; // 用户ID，后端需要验证用户身份
  noteId: number;
  initialCount: number;
  initialLiked?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  userId,
  noteId,
  initialCount,
  initialLiked = false,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [liked, setLiked] = useState<boolean>(initialLiked);
  // console.log("LikeButton props", { userId, noteId, initialCount, initialLiked });

  useEffect(() => {
    setCount(initialCount ?? 0);
  }, [initialCount]);
  useEffect(() => {
    setLiked(initialLiked ?? false);
  }, [initialLiked]);

  const onToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止父容器点击
    // 乐观更新
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const { liked: newLiked, likes: newCount } = await apiToggleNoteLike(noteId, userId);
      setLiked(newLiked);
      setCount(newCount);
      message.success(newLiked ? '点赞成功' : '取消点赞成功');
    } catch {
      // 回滚
      setLiked(prevLiked);
      setCount(prevCount);
      message.error('点赞操作失败，请稍后重试');
    }
  };
  // console.log("count, liked", { count, liked });
  return (
    <Space onClick={onToggle} style={{ cursor: 'pointer' }}>
      {liked ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
      <span>{count}</span>
    </Space>
  );
};

export default LikeButton;
