import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, List, Pagination, message, Row, Col, Typography } from 'antd';
import { history } from 'umi';
import styled from 'styled-components';
import {
  fetchPosts as apiFetchPosts
} from '@/services/ant-design-pro/api';
import CreatePost from './Posts/components/CreatePost';
import ForumLikeButton from './Posts/components/LikeButton';

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
const mockHotPosts: API.BlogSummary[] = [
  {
    id: 999,
    title: "COMP3900项目经验分享 - 从零到部署完整指南",
    content: "分享我们团队在COMP3900项目中的开发经验，包括前后端架构设计、数据库优化、部署流程等...",
    author: "学长小王",
    updateTime: "2024-01-15T10:30:00"
  },
  {
    id: 998,
    title: "数据结构与算法期末复习重点整理",
    content: "整理了COMP3121课程的所有重点知识点，包括动态规划、图算法、排序算法等，附带练习题...",
    author: "算法大神",
    updateTime: "2024-01-14T16:45:00"
  }
];

const mockLatestPosts: API.BlogSummary[] = [
  {
    id: 996,
    title: "求组队！COMP6080 Assignment 3",
    content: "正在寻找队友一起完成COMP6080的第三个作业，React项目，有经验的同学请联系...",
    author: "新同学小李",
    updateTime: "2024-01-16T09:15:00"
  },
  {
    id: 995,
    title: "Kensington附近租房信息分享",
    content: "刚找到不错的房源，地理位置优越，价格合理，有需要的同学可以了解一下...",
    author: "租房小助手",
    updateTime: "2024-01-16T08:30:00"
  }
];

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<API.BlogSummary[]>([]);
  const [hotPosts, setHotPosts] = useState<API.BlogSummary[]>([]);
  const [latestPosts, setLatestPosts] = useState<API.BlogSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  // 加载Mock热门帖子
  const loadHotPosts = async () => {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 100));
      setHotPosts(mockHotPosts);
    } catch (error) {
      console.error('加载热门帖子失败:', error);
    }
  };

  // 加载Mock最新帖子
  const loadLatestPosts = async () => {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 100));
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
      console.log('Fetched posts:', res);
      setPosts(res.blogSumList || []);
      setTotal(res.total);
      if (res.pageSize) setPageSize(res.pageSize);
      if (res.page) setCurrentPage(res.page);
    } catch (error) {
      message.error('加载帖子失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(currentPage, pageSize);
    loadHotPosts();
    loadLatestPosts();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const counts: Record<number, number> = {};
    posts.forEach(post => {
      counts[post.id] = likeCounts[post.id] || 0;
    });
    setLikeCounts(counts);
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

  const handlePostClick = (postId: number) => {
    history.push(`/forum/${postId}`);
  };

  return (
    <CenteredContainer>
      <PageContainer>
        <CreatePost onSuccess={handlePostCreated} />

        {/* 热门和最新帖子区域 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12}>
            <SectionContainer>
              <SectionTitle level={4}>🔥 热门帖子</SectionTitle>
              {hotPosts.map((post, index) => (
                <HotPostCard
                  key={post.id}
                  size="small"
                  onClick={() => handlePostClick(post.id)}
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
                  onClick={() => handlePostClick(post.id)}
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
                  onClick={() => handlePostClick(item.id)}
                >
                  <p>{item.content}</p>
                  <ForumLikeButton postId={item.id} initialCount={likeCounts[item.id] || 0} />
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
