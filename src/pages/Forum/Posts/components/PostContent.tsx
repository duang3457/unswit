import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import ForumLikeButton from './LikeButton';


const ImageContainer = styled.div`
  margin: 16px 0;
`;

const PostImage = styled.img`
  max-width: 100%;
  margin-bottom: 8px;
`;

const ContentContainer = styled.div`
  margin-top: 16px;
`;

const CommentCountLabel = styled.strong`
  margin-left: 16px;
`;

const PostContent: React.FC<{ blog: API.Blog }> = ({ blog }) => {
  return (
    <Card>
      <p>
        <strong>作者：</strong>
        {blog.authorName}
      </p>
      <p>
        <strong>创建时间：</strong>
        {new Date(blog.createTime).toLocaleString()}
      </p>
      <p>
        <strong>最后更新时间：</strong>
        {new Date(blog.updateTime).toLocaleString()}
      </p>
      <p>
        <ForumLikeButton postId={blog.id} initialCount={blog.likeCount || 0} />
        <CommentCountLabel>评论数：</CommentCountLabel>
        {blog.commentCount}
      </p>
      {blog.images && blog.images.length > 0 && (
        <ImageContainer>
          {blog.images.map((url) => (
            <PostImage key={url} src={url} alt="帖子图片" />
          ))}
        </ImageContainer>
      )}
      <hr />
      <ContentContainer>{blog.content}</ContentContainer>
    </Card>
  );
};

export default PostContent; 