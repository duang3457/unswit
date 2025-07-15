import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import ForumLikeButton from './LikeButton/index';

const ImageContainer = styled.div`
  margin: 16px 0;
`;

const PostImage = styled.img`
  max-width: 100%;
  margin-bottom: 8px;
`;

const ContentContainer = styled.div`
  margin-top: 16px;
  white-space: normal;
  word-break: break-all;
  overflow-wrap: break-word;
`;

const CommentCountLabel = styled.strong`
  margin-left: 16px;
`;

const PostContent: React.FC<{ post: API.Post; liked: boolean }> = ({ post, liked }) => {
  return (
    <Card>
      <p>
        <strong>作者：</strong>
        {post.authorName}
      </p>
      <p>
        <strong>创建时间：</strong>
        {new Date(post.createTime).toLocaleString()}
      </p>
      <p>
        <strong>最后更新时间：</strong>
        {new Date(post.updateTime).toLocaleString()}
      </p>
      <p>
        <ForumLikeButton postId={post.id} initialCount={post.likeCount || 0} initialLiked={liked} />
        <CommentCountLabel>评论数：</CommentCountLabel>
        {post.commentCount}
      </p>
      {post.images && post.images.length > 0 && (
        <ImageContainer>
          {post.images.map((url) => (
            <PostImage key={url} src={url} alt="帖子图片" />
          ))}
        </ImageContainer>
      )}
      <hr />
      <ContentContainer>{post.content}</ContentContainer>
    </Card>
  );
};

export default PostContent;
