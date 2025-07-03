import React from 'react';
import { Card, List } from 'antd';

interface Comment {
  id: number;
  authorName: string;
  content: string;
  createTime: string;
}

const CommentList: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  if (comments.length === 0) return null;
  return (
    <Card title={`评论 (${comments.length})`} style={{ marginTop: 24 }}>
      <List
        itemLayout="vertical"
        dataSource={comments}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
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