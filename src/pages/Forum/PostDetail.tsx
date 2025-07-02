import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button, Spin, message, List } from 'antd';
import { fetchPostDetail } from '@/services/ant-design-pro/api'; // 根据项目路径调整

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const [data, setData] = useState<API.BlogComment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPostDetail(postId)
      .then((res: API.BlogComment) => {
        setData(res);
        console.log('Fetched post detail:', res);
      })
      .catch(() => {
        message.error('加载帖子失败，请稍后重试');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId]);

  if (loading) {
    return (
      <PageContainer>
        <Spin tip="加载中..." />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <Card>
          <p>帖子不存在或已被删除。</p>
          <Button type="primary" onClick={() => history.push('/forum')}>
            返回论坛
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const { blog, comments } = data;
  const commentList = comments;

  return (
    <PageContainer
      header={{
        title: blog.title,
        breadcrumb: {},
        onBack: () => history.goBack(),
      }}
    >
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
          <strong>点赞数：</strong>
          {blog.likeCount} <strong>评论数：</strong>
          {blog.commentCount}
        </p>
        {blog.images && blog.images.length > 0 && (
          <div style={{ margin: '16px 0' }}>
            {blog.images.map((url) => (
              <img
                key={url}
                src={url}
                alt="帖子图片"
                style={{ maxWidth: '100%', marginBottom: 8 }}
              />
            ))}
          </div>
        )}
        <hr />
        <div style={{ marginTop: 16 }}>{blog.content}</div>
      </Card>

      {/* 评论列表 */}
      <Card style={{ marginTop: 24 }} title={`评论 (${commentList.length})`}>
        <List
          itemLayout="vertical"
          dataSource={commentList}
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
    </PageContainer>
  );
};

export default PostDetailPage;
