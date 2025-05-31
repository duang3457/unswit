import React from 'react';
import { useParams, history } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Button } from 'antd';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

// 假数据，后面可以换成后端请求
const mockPosts: Post[] = [
  {
    id: 1,
    title: '欢迎来到论坛',
    content: '这是一个示例帖子，欢迎发表您的看法！',
    author: 'Admin',
    createdAt: '2025-06-01',
  },
  {
    id: 2,
    title: '如何使用Ant Design Pro搭建论坛？',
    content: '这里可以讨论技术、问题、想法等。',
    author: 'Yang',
    createdAt: '2025-06-01',
  },
];

const PostDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);

  // 找到对应帖子
  const post = mockPosts.find(item => item.id === postId);

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
        onBack: () => history.goBack(),  // umi4是back方法,我们用的是umi3
      }}
    >
      <Card>
        <p><strong>作者：</strong>{post.author}</p>
        <p><strong>发布时间：</strong>{post.createdAt}</p>
        <hr />
        <div style={{ marginTop: 16 }}>{post.content}</div>
      </Card>
    </PageContainer>
  );
};

export default PostDetailPage;
