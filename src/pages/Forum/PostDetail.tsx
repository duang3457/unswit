import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, history } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { message, Spin } from 'antd';
import styled from 'styled-components';
import {
  fetchPostDetail as apiFetchPostDetail,
  createComment as apiCreateComment,
} from '@/services/ant-design-pro/apis/postApi';
import PostContent from './Posts/components/PostContent';
import CommentList from './Comments/CommentList';
import CommentEditor from './Comments/CommentEditor';
import SidebarActions from './Comments/components/SidebarActions';

const ContentWrapper = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0;
  }
`;

const PostDetailPage: React.FC = () => {
  // 1. 拿到 search 字符串
  const { search } = useLocation();
  // 2. 用 URLSearchParams 解析
  const params = new URLSearchParams(search);
  const liked = params.get('liked') === '1';

  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const [data, setData] = useState<API.PostComment | null>(null);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const commentAnchorRef = useRef<HTMLDivElement>(null);

  const loadPostDetail = () => {
    setLoading(true);
    apiFetchPostDetail(postId)
      .then((res: API.PostComment) => {
        setData(res);
      })
      .catch(() => {
        message.error('加载帖子失败，请稍后重试');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPostDetail();
    // eslint-disable-next-line
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    setCommentLoading(true);
    try {
      const response = await apiCreateComment({
        postId: postId,
        content: commentContent.trim(),
      });
      if (response) {
        message.success('评论发布成功！');
        setCommentContent('');
        await loadPostDetail();
      } else {
        message.error('发布评论失败，请稍后重试');
      }
    } catch (error) {
      console.error('发布评论失败，请稍后重试', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToComment = () => {
    if (commentAnchorRef.current) {
      commentAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.focus();
    }, 400);
  };

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
        <div style={{ padding: 24 }}>
          <p>帖子不存在或已被删除。</p>
          <a onClick={() => history.push('/forum')}>返回论坛</a>
        </div>
      </PageContainer>
    );
  }

  const { post, comments } = data;

  return (
    <PageContainer
      header={{
        title: post.title,
        breadcrumb: {},
        onBack: () => history.goBack(),
      }}
    >
      <ContentWrapper>
        <PostContent post={post} liked={liked} />
        <CommentList comments={comments} />
        <CommentEditor
          value={commentContent}
          loading={commentLoading}
          onChange={(e) => setCommentContent(e.target.value)}
          onSubmit={handleSubmitComment}
          refAnchor={commentAnchorRef}
        />
        <SidebarActions
          onScrollToTop={handleScrollToTop}
          onScrollToComment={handleScrollToComment}
        />
      </ContentWrapper>
    </PageContainer>
  );
};

export default PostDetailPage;
