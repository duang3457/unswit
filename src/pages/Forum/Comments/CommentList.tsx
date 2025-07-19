import React, { useState } from 'react';
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
  // 点击回复时的回调，parentId 为一级评论ID，replyAuthorId 为实际被回复用户ID，replyAuthorName 为被回复的用户名
  onReply: (parentId: number, replyAuthorId: string, replyAuthorName: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReply }) => {
  // 扩展状态：expanded 控制回复展开，openContent 控制内容展开
  const [expansionMap, setExpansionMap] = useState<{
    expanded: Set<number>;
    openContent: Set<number>;
  }>({ expanded: new Set(), openContent: new Set() });
  const { expanded, openContent } = expansionMap;
  const toggleExpand = (id: number) => {
    setExpansionMap(prev => {
      const expandedSet = new Set(prev.expanded);
      if (expandedSet.has(id)) expandedSet.delete(id);
      else expandedSet.add(id);
      return { ...prev, expanded: expandedSet };
    });
  };
  const toggleContent = (id: number) => {
    setExpansionMap(prev => {
      const contentSet = new Set(prev.openContent);
      if (contentSet.has(id)) contentSet.delete(id);
      else contentSet.add(id);
      return { ...prev, openContent: contentSet };
    });
  };
  if (!comments || comments.length === 0) {
    return <Text type="secondary">暂无评论</Text>;
  }
  return (
    <Card title={`评论 (${comments.length})`} style={{ marginTop: 24 }}>
      <List
        itemLayout="vertical"
        dataSource={comments}
        pagination={{ pageSize: 5, total: comments.length, showSizeChanger: false }}
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
            <div
              style={{
                marginBottom: 12,
                ...(openContent.has(comment.id)
                  ? { whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'visible' }
                  : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }),
              }}
            >
              {comment.content}
              <Button type="link" size="small" onClick={() => toggleContent(comment.id)}>
                {openContent.has(comment.id) ? '收起' : '展开'}
              </Button>
            </div>
            {/* 一级评论和二级评论都支持回复，父ID总是一级评论的ID */}
            <Button
              type="link"
              size="small"
              onClick={() => onReply(comment.id, comment.authorId, comment.authorName)}
            >
              回复
            </Button>

            {/* 二级评论区，可展开 */}
            {comment.children && comment.children.length > 0 && (
              <div style={{ paddingLeft: 48 }}>
                {expanded.has(comment.id) ? (
                  <>
                    <Button type="link" size="small" onClick={() => toggleExpand(comment.id)}>
                      收起回复
                    </Button>
                    <List
                      dataSource={comment.children}
                      itemLayout="vertical"
                      size="small"
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
                          <div
                            style={{
                              marginBottom: 12,
                              ...(openContent.has(child.id)
                                ? { whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'visible' }
                                : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }),
                            }}
                          >
                            {child.content}
                            <Button type="link" size="small" onClick={() => toggleContent(child.id)}>
                              {openContent.has(child.id) ? '收起' : '展开'}
                            </Button>
                          </div>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => onReply(child.parentId ?? comment.id, child.authorId, child.authorName)}
                    >
                      回复
                    </Button>
                        </List.Item>
                      )}
                    />
                  </>
                ) : (
                  <Button type="link" size="small" onClick={() => toggleExpand(comment.id)}>
                    查看{comment.children.length} 条回复
                  </Button>
                )}
              </div>
            )}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CommentList;
