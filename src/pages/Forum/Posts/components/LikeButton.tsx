import React, { useState } from 'react';
import { message } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { likeBlog } from '@/services/ant-design-pro/api';
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
  cursor: ${({ liked }) => (liked ? 'default' : 'pointer')};
  user-select: none;
  margin-right: 8px;
`;

interface IconProps {
  size: number;
  liked?: boolean;
}

const StyledHeartFilled = styled(HeartFilled)<IconProps>`
  color: red;
  font-size: ${({ size }) => size}px;
`;

const StyledHeartOutlined = styled(HeartOutlined)<IconProps>`
  font-size: ${({ size }) => size}px;
`;

const ForumLikeButton: React.FC<ForumLikeButtonProps> = ({
  postId,
  initialCount,
  initialLiked = false,
  size = 20,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return; // 简单防止重复点赞
    setLoading(true);
    try {
      const res = await likeBlog(postId);
      console.log(res);
      if (res.success) {
        setCount(count + 1);
        setLiked(true);
        message.success('点赞成功');
      } else {
        console.error(res.errorMsg || '点赞失败');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LikeSpan liked={liked} onClick={handleLike}>
      {liked ? <StyledHeartFilled size={size} /> : <StyledHeartOutlined size={size} />} {count}
    </LikeSpan>
  );
};

export default ForumLikeButton; 