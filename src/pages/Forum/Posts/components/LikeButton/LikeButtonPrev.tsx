import React, { useState } from 'react';
import { message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { likeBlog } from '@/services/ant-design-pro/api_old';
import styled from 'styled-components';

interface ForumLikeButtonProps {
  postId: number;
  initialCount: number;
  initialLiked?: boolean;
  size?: number;
}

interface LikeSpanProps {
  liked: boolean;
}

const LikeSpan = styled.span<LikeSpanProps>`
  cursor: pointer;
  user-select: none;
  margin-right: 8px;
  opacity: ${({ liked }) => (liked ? 1 : 0.8)};
`;

interface IconProps {
  size: number;
}

const StyledHeartFilled = styled(HeartFilled)<IconProps>`
  color: red;
  font-size: ${({ size }) => size}px;
`;

const StyledHeartOutlined = styled(HeartOutlined)<IconProps>`
  font-size: ${({ size }) => size}px;
`;

const ForumLikeButtonPrev: React.FC<ForumLikeButtonProps> = ({
  postId,
  initialCount,
  initialLiked = false,
  size = 20,
}) => {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return; // 防止快速重复点击
    setLoading(true);
    try {
      const success = await likeBlog(postId);
      if (success) {
        // 如果当前是已点赞，就减 1 并变成“未点赞”；否则加 1 并变成“已点赞”
        setCount((prev) => (liked ? prev - 1 : prev + 1));
        setLiked((prev) => !prev);
        message.success(liked ? '已取消点赞' : '点赞成功');
      } else {
        message.error('操作失败，请重试');
      }
    } catch (err) {
      console.error(err);
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LikeSpan liked={liked} onClick={handleLike}>
      {liked ? <StyledHeartFilled size={size} /> : <StyledHeartOutlined size={size} />}
      &nbsp;{count}
    </LikeSpan>
  );
};

export default ForumLikeButtonPrev;
