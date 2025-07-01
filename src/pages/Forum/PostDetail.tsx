import React, { useEffect, useState } from 'react';
import { useParams, history, request } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button, Spin, message } from 'antd';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const PostDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    request<Post>(`/api/posts/${postId}`, {
      method: 'GET',
    })
      .then((data) => {
        setPost(data);
      })
      .catch((error) => {
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

  if (!post) {
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

  return (
    <PageContainer
      header={{
        title: post.title,
        breadcrumb: {},
        onBack: () => history.goBack(),
      }}
    >
      <Card>
        <p>
          <strong>作者：</strong>
          {post.author}
        </p>
        <p>
          <strong>发布时间：</strong>
          {post.createdAt}
        </p>
        <hr />
        <div style={{ marginTop: 16 }}>{post.content}</div>
      </Card>
    </PageContainer>
  );
};

export default PostDetailPage;
