import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  List,
  Alert,
  Pagination,
  message,
  Row,
  Col,
  Typography,
  Space,
  Avatar,
  Radio,
} from 'antd';
import { history, useModel } from 'umi';
import styled, { css } from 'styled-components';
import {
  fetchPosts as apiFetchPosts,
  fetchPostLikes as apiFetchPostLikes,
} from '@/services/ant-design-pro/apis/postApi';
import CreatePost from './Posts/components/CreatePost';
import ForumLikeButton from './Posts/components/LikeButton/index';
import Marquee from 'react-fast-marquee';
import { UserOutlined } from '@ant-design/icons';

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

// 高亮动画List.Item
const AnimatedListItem = styled(List.Item)<{ $highlighted?: boolean }>`
  && {
    background: ${({ $highlighted }) => ($highlighted ? '#e6f7ff' : '#fff')};
    border-radius: 6px;
    transition: background 0.8s cubic-bezier(0.4,0,0.2,1);
  }
`;

const AnimatedCard = styled(Card)<{ $highlighted?: boolean }>`
  && {
    background: ${({ $highlighted }) => ($highlighted ? '#e6f7ff' : '#fff')};
    border: none;
    border-radius: 6px;
    transition: background 0.8s cubic-bezier(0.4,0,0.2,1);
  }
`;

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
  // 排序状态：latest 最新，hot 热门
  const [sortKey, setSortKey] = useState<'latest' | 'hot'>('latest');
  // 搜索关键词
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 点赞相关状态
  const [initialLikes, setInitialLikes] = useState<Record<number, number>>({});
  const [initialLiked, setInitialLiked] = useState<Record<number, boolean>>({});
  const [highlightedPostId, setHighlightedPostId] = useState<number | null>(null);

  // 加载热门帖子（按点赞数降序，显示前2条）
  const loadHotPosts = async () => {
    try {
      const res = await apiFetchPosts(1, 2, {
        params: { page: 1, pageSize: 2, sortBy: 'likeCount', sortOrder: 'desc' },
      });
      setHotPosts(res.postSumList || []);
    } catch (error) {
      console.error('加载热门帖子失败:', error);
    }
  };

  // 加载最新帖子（按时间降序，显示前2条）
  const loadLatestPosts = async () => {
    try {
      const res = await apiFetchPosts(1, 2, {
        params: { page: 1, pageSize: 2, sortBy: 'updateTime', sortOrder: 'desc' },
      });
      setLatestPosts(res.postSumList || []);
    } catch (error) {
      console.error('加载最新帖子失败:', error);
    }
  };

  // 获取并渲染帖子列表
  const loadPosts = async (page: number, size: number) => {
    setLoading(true);
    try {
      // 根据排序传参
      const params: any = { page, pageSize: size };
      if (sortKey === 'hot') {
        params.sortBy = 'likeCount';
        params.sortOrder = 'desc';
      } else {
        params.sortBy = 'updateTime';
        params.sortOrder = 'desc';
      }
      // // 添加搜索参数
      // if (searchTerm) {
      //   params.search = searchTerm;
      // }
      const res = await apiFetchPosts(page, size, { params });
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

  // 首页加载及分页、排序变化时刷新列表
  useEffect(() => {
    loadPosts(currentPage, pageSize);
  }, [currentPage, pageSize, sortKey, searchTerm]);
  // 热门/最新专区保持原调用
  useEffect(() => {
    loadHotPosts();
    loadLatestPosts();
  }, []);

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

  // 页面加载时检测localStorage，自动跳转页码并高亮
  useEffect(() => {
    const lastView = localStorage.getItem('forum_last_view');
    if (lastView) {
      try {
        const { page, postId } = JSON.parse(lastView);
        if (page && page !== currentPage) {
          setCurrentPage(page); // 跳转到存储的页码
        }
        setHighlightedPostId(postId);
        // 1.5秒后自动取消高亮
        setTimeout(() => setHighlightedPostId(null), 2000);
      } catch {}
      localStorage.removeItem('forum_last_view');
    }
  }, []);

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
    // 存储当前页码和帖子id
    localStorage.setItem('forum_last_view', JSON.stringify({
      page: currentPage,
      postId,
    }));
    history.push({
      pathname: `/forum/${postId}`,
      query: { liked: liked ? '1' : '0' },
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

        {/* 新建帖子和排序控件一行展示 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'nowrap',
            width: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          <CreatePost onSuccess={handlePostCreated} />
          <Radio.Group
            value={sortKey}
            onChange={(e) => {
              setSortKey(e.target.value);
              setCurrentPage(1);
            }}
            style={{ display: 'flex', flexDirection: 'row', gap: 8 }}
          >
            <Radio.Button value="latest">最新</Radio.Button>
            <Radio.Button value="hot">热门</Radio.Button>
          </Radio.Group>
        </div>

        {/* // 搜索框
        <Input.Search
          placeholder="搜索帖子"
          allowClear
          enterButton
          onSearch={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          style={{ width: 300, marginBottom: 16 }}
        /> */}

        {/* 原有的帖子列表 */}
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 16, column: 1 }}
          dataSource={posts}
          renderItem={(item) => {
            const formatted = formatDate(item.updateTime);
            const isHighlighted = item.id === highlightedPostId;
            return (
              <AnimatedListItem $highlighted={isHighlighted}>
                <AnimatedCard
                  $highlighted={isHighlighted}
                  title={item.title}
                  extra={
                    <Space align="center" size="small">
                      <Avatar src={(item as any).authorAvatar} icon={<UserOutlined />} size={24} />
                      <Typography.Text type="secondary">
                        {item.author} 发布于 {formatted}
                      </Typography.Text>
                    </Space>
                  }
                  hoverable
                  onClick={() => handlePostClick(item.id, initialLiked[item.id])}
                >
                  <p>{item.content}</p>
                  {/* 帖子操作区：点赞和评论数 */}
                  <Space size="middle" style={{ marginTop: 8 }}>
                    <ForumLikeButton
                      key={item.id}
                      postId={item.id}
                      initialCount={initialLikes[item.id]}
                      initialLiked={initialLiked[item.id]}
                      onChange={(id, liked, count) => {
                        setInitialLiked((prev) => ({ ...prev, [id]: liked }));
                        setInitialLikes((prev) => ({ ...prev, [id]: count }));
                      }}
                    />
                    <Typography.Text type="secondary">{item.commentCount} 条评论</Typography.Text>
                  </Space>
                </AnimatedCard>
              </AnimatedListItem>
            );
          }}
        />

        <StyledPagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={['5', '10', '20']}
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
