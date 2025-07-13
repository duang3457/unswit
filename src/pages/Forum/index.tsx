import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, List, Alert, Pagination, message, Row, Col, Typography } from 'antd';
import { history, useModel } from 'umi';
import styled from 'styled-components';
import {
  fetchPosts as apiFetchPosts,
  fetchPostLikes as apiFetchPostLikes,
} from '@/services/ant-design-pro/apis/postApi';
import CreatePost from './Posts/components/CreatePost';
import ForumLikeButton from './Posts/components/LikeButton/index';
import Marquee from 'react-fast-marquee';

const StyledPagination = styled(Pagination)`
  margin-top: 16px;
  text-align: right;
`;

const SectionContainer = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled(Typography.Title)`
  && {
    margin-bottom: 16px;
    font-size: 18px;
  }
`;

const HotPostCard = styled(Card)`
  && {
    margin-bottom: 8px;
    cursor: pointer;

    .ant-card-body {
      padding: 12px 16px;
    }

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
`;

const PostMeta = styled.div`
  color: #999;
  font-size: 12px;
  margin-top: 4px;
`;

const CenteredContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
`;

// Mock数据 - 每个区域只显示2个
const mockHotPosts: API.PostSummary[] = [
  {
    id: 999,
    title: 'COMP3900项目经验分享 - 从零到部署完整指南',
    content:
      '分享我们团队在COMP3900项目中的开发经验，包括前后端架构设计、数据库优化、部署流程等...',
    author: '学长小王',
    likeCount: 120,
    commentCount: 45,
    updateTime: '2024-01-15T10:30:00',
  },
  {
    id: 998,
    title: '数据结构与算法期末复习重点整理',
    content: '整理了COMP3121课程的所有重点知识点，包括动态规划、图算法、排序算法等，附带练习题...',
    author: '算法大神',
    likeCount: 95,
    commentCount: 30,
    updateTime: '2024-01-14T16:45:00',
  },
];

const mockLatestPosts: API.PostSummary[] = [
  {
    id: 996,
    title: '求组队！COMP6080 Assignment 3',
    content: '正在寻找队友一起完成COMP6080的第三个作业，React项目，有经验的同学请联系...',
    author: '新同学小李',
    likeCount: 30,
    commentCount: 10,
    updateTime: '2024-01-16T09:15:00',
  },
  {
    id: 995,
    title: 'Kensington附近租房信息分享',
    content: '刚找到不错的房源，地理位置优越，价格合理，有需要的同学可以了解一下...',
    author: '租房小助手',
    likeCount: 20,
    commentCount: 5,
    updateTime: '2024-01-16T08:30:00',
  },
];

const ForumPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const userId = initialState?.currentUser?.id;
  const [posts, setPosts] = useState<API.PostSummary[]>([]);
  const [hotPosts, setHotPosts] = useState<API.PostSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<API.PostSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // 点赞相关状态
  const [initialLikes, setInitialLikes] = useState<Record<number, number>>({});
  const [initialLiked, setInitialLiked] = useState<Record<number, boolean>>({});

  // 加载Mock热门帖子
  const loadHotPosts = async () => {
    try {
      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 100));
      setHotPosts(mockHotPosts);
    } catch (error) {
      console.error('加载热门帖子失败:', error);
    }
  };

  // 加载Mock最新帖子
  const loadLatestPosts = async () => {
    try {
      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLatestPosts(mockLatestPosts);
    } catch (error) {
      console.error('加载最新帖子失败:', error);
    }
  };

  // 获取并渲染帖子列表
  const loadPosts = async (page: number, size: number) => {
    setLoading(true);
    try {
      const res = await apiFetchPosts(page, size);
      setPosts(res.postSumList || []);
      setTotal(res.total);
      if (res.pageSize) setPageSize(res.pageSize);
      if (res.page) setCurrentPage(res.page);
    } catch (error) {
      message.error('加载帖子失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // loadPosts
  useEffect(() => {
    loadPosts(currentPage, pageSize);
    loadHotPosts();
    loadLatestPosts();
  }, [currentPage, pageSize]);

  // 批量获取点赞状态 & 计数
  useEffect(() => {
    const ids = posts.map((post) => post.id);
    if (!ids.length) return;

    apiFetchPostLikes({
      data: { postIds: ids, userId: userId },
    })
      .then(({ likes, likedByUser }) => {
        setInitialLikes(likes);
        setInitialLiked(likedByUser);
      })
      .catch(() => {
        message.error('获取点赞状态失败');
      });
  }, [posts]);

  const handlePostCreated = () => {
    loadPosts(1, pageSize);
    // Mock数据不需要重新加载，但保持一致性
    loadHotPosts();
    loadLatestPosts();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handlePostClick = (postId: number, liked: boolean) => {
    history.push({
      pathname: `/forum/${postId}`,
      query: { liked: liked ? '1' : '0' }, // 使用query参数传递点赞状态
    });
  };

  return (
    <CenteredContainer style={{ padding: 0 }}>
      <PageContainer childrenContentStyle={{ padding: 8, marginTop: 8 }}>
        <Alert
          banner
          type="success"
          // closable
          message={
            <Marquee pauseOnHover gradient={false}>
              {`这里是UNSWIT论坛!`}
            </Marquee>
          }
        />
        {/* 热门和最新帖子区域 */}
        <Row gutter={16} style={{ marginBottom: 12, marginTop: 12 }}>
          <Col xs={24} sm={12}>
            <SectionContainer>
              <SectionTitle level={4}>🔥 热门帖子</SectionTitle>
              {hotPosts.map((post, index) => (
                <HotPostCard
                  key={post.id}
                  size="small"
                  onClick={() => handlePostClick(post.id, initialLiked[post.id])}
                >
                  <div>
                    <Typography.Text strong>
                      {index + 1}. {post.title}
                    </Typography.Text>
                    <PostMeta>
                      {post.author} · {formatDate(post.updateTime)}
                    </PostMeta>
                  </div>
                </HotPostCard>
              ))}
            </SectionContainer>
          </Col>

          <Col xs={24} sm={12}>
            <SectionContainer>
              <SectionTitle level={4}>⭐ 最新帖子</SectionTitle>
              {latestPosts.map((post) => (
                <HotPostCard
                  key={post.id}
                  size="small"
                  onClick={() => handlePostClick(post.id, initialLiked[post.id])}
                >
                  <div>
                    <Typography.Text strong>{post.title}</Typography.Text>
                    <PostMeta>
                      {post.author} · {formatDate(post.updateTime)}
                    </PostMeta>
                  </div>
                </HotPostCard>
              ))}
            </SectionContainer>
          </Col>
        </Row>

        <CreatePost onSuccess={handlePostCreated} />

        {/* 原有的帖子列表 */}
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 16, column: 1 }}
          dataSource={posts}
          renderItem={(item) => {
            const formatted = formatDate(item.updateTime);
            return (
              <List.Item>
                <Card
                  title={item.title}
                  extra={`${item.author} 发布于 ${formatted}`}
                  hoverable
                  onClick={() => handlePostClick(item.id, initialLiked[item.id])}
                >
                  <p>{item.content}</p>
                  <ForumLikeButton
                    key={item.id}
                    postId={item.id}
                    initialCount={initialLikes[item.id]}
                    initialLiked={initialLiked[item.id]}
                    onChange={(id, liked, count) => {
                      // 只改这个 post 的 liked/count，别全量重拉
                      setInitialLiked((prev) => ({ ...prev, [id]: liked }));
                      setInitialLikes((prev) => ({ ...prev, [id]: count }));
                    }}
                  />
                </Card>
              </List.Item>
            );
          }}
        />

        <StyledPagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </PageContainer>
    </CenteredContainer>
  );
};

export default ForumPage;
