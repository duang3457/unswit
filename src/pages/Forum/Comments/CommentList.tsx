import React from 'react';
import { Card, List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledAvatar = styled(Avatar)`
  border-radius: 50%;
`;

const CommentList: React.FC<{ comments: API.Comment[] }> = ({ comments }) => {
  if (comments.length === 0) return null;
  console.log(comments);
  return (
    <Card title={`评论 (${comments.length})`} style={{ marginTop: 24 }}>
      <List
        itemLayout="vertical"
        dataSource={comments}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <StyledAvatar
                  src={item.authorAvatar}
                  alt={item.authorName}
                  icon={<UserOutlined />}
                  size={40}
                />
              }
              title={item.authorName}
              description={new Date(item.createTime).toLocaleString()}
            />
            <div>{item.content}</div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CommentList; 