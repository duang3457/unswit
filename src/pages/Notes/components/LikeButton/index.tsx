// src/components/LikeButton.tsx

import React, { useState, useEffect } from 'react';
import { Space, message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { toggleNoteLike, fetchNoteLikes } from '@/services/ant-design-pro/api';

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

  // // 初次挂载时 parent 大概率没传 initialCount/initialLiked，需要在这里再 fetch 一次
  // // 而useState只在第一次挂载时执行，所以这里需要 useEffect 来获取初始状态
  // // 但是我不想再发请求了，显得很shaX,就用了上面的useEffect：让count和linked每次初始值变化时都会更新
  // useEffect(() => {
  //     console.log("LikeButton useEffect", { noteId, initialCount, initialLiked });
  //     fetchNoteLikes({
  //       data: {
  //         noteIds: [noteId],
  //         userId: userId,
  //       }
  //     })
  //       .then(({ likes, likedByUser }) => {
  //         setCount(likes[noteId] || 0);
  //         setLiked(!!likedByUser[noteId]);
  //       })
  //       .catch(() => {
  //         message.error('获取点赞状态失败');
  //       });

  // }, [noteId, initialCount, initialLiked]);

  const onToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止父容器点击
    // 乐观更新
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const { liked: newLiked, likes: newCount } = await toggleNoteLike(noteId, userId);
      setLiked(newLiked);
      setCount(newCount);
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
