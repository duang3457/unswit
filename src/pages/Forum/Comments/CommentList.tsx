import React from 'react';
import { Card, List, Avatar, Typography, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

const StyledAvatar = styled(Avatar)`
  border-radius: 50%;
`;

interface CommentListProps {
  comments: API.CommentTree[];
  /** 点击回复时的回调，parentId 为一级评论ID，replyAuthorOneId 为实际被回复用户ID */
  onReply: (parentId: number, replyAuthorId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReply }) => {
  if (!comments || comments.length === 0) {
    return <Text type="secondary">暂无评论</Text>;
  }
  return (
    <Card title={`评论 (${comments.length})`} style={{ marginTop: 24 }}>
      <List
        itemLayout="vertical"
        dataSource={comments}
        // 遍历每一个评论结点
        renderItem={(comment) => (
          <List.Item key={comment.id}>
            <List.Item.Meta
              avatar={
                <StyledAvatar
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  icon={<UserOutlined />}
                  size={40}
                />
              }
              title={comment.authorName}
              description={new Date(comment.createTime).toLocaleString()}
            />
            <div style={{ marginBottom: 12 }}>{comment.content}</div>
            {/* 一级评论和二级评论都支持回复，父ID总是一级评论的ID */}
            <Button
              type="link"
              size="small"
              onClick={() =>
                onReply(
                  // 父评论id: 所回复对象的ID
                  comment.id,
                  // 所回复对象的作者ID
                  comment.authorId,
                )
              }
            >
              回复
            </Button>

            {/* 二级评论列表 */}
            {comment.children && comment.children.length > 0 && (
              <List
                dataSource={comment.children}
                itemLayout="vertical"
                size="small"
                style={{ paddingLeft: 48 }}
                renderItem={(child) => (
                  <List.Item key={child.id}>
                    <List.Item.Meta
                      avatar={
                        <StyledAvatar
                          src={child.authorAvatar}
                          alt={child.authorName}
                          icon={<UserOutlined />}
                          size={32}
                        />
                      }
                      title={child.authorName}
                      description={new Date(child.createTime).toLocaleString()}
                    />
                    <div style={{ marginBottom: 12 }}>{child.content}</div>
                    {/* 在二级评论下也展示回复按钮，但父ID仍为一级评论 */}
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        onReply(
                          // 父评论id：所回复对象的父评论ID，如果不存在则使用 comment.id 作为一级评论ID
                          child.parentId ?? comment.id,
                          child.authorId,
                        )
                      }
                    >
                      回复
                    </Button>
                  </List.Item>
                )}
              />
            )}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CommentList;
