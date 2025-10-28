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
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const liked = params.get('liked') === '1';

  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const [data, setData] = useState<API.PostComment | null>(null);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const commentAnchorRef = useRef<HTMLDivElement>(null);
  // 回复相关状态
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const [replyAuthorOneId, setReplyAuthorOneId] = useState<string | null>(null);

  const loadPostDetail = () => {
    setLoading(true);
    apiFetchPostDetail(postId)
      .then((res) => setData(res))
      .catch(() => message.error('加载帖子失败，请稍后重试'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPostDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // 点击回复按钮，parentId: 一级评论ID，authorId: 被回复作者ID，authorName: 被回复用户名
  const handleReply = (parentId: number, authorId: string, authorName: string) => {
    // 设置回复的目标评论ID和被回复作者ID
    setReplyParentId(parentId);
    setReplyAuthorOneId(authorId);
    // 输入框预置 @用户名
    setCommentContent(`@${authorName} `);
    // 滚动到编辑框并获取焦点
    commentAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => document.querySelector('textarea')?.focus(), 300);
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    setCommentLoading(true);
    try {
      // 调用接口，传入 parentId 和 replyAuthorOneId
      const payload: any = { postId, content: commentContent.trim() };
      if (replyParentId != null) payload.parentId = replyParentId;
      if (replyAuthorOneId) payload.replyAuthorOneId = replyAuthorOneId;
      const ok = await apiCreateComment(payload);
      if (ok) {
        message.success('评论发布成功！');
        setCommentContent('');
        setReplyParentId(null);
        setReplyAuthorOneId(null);
        await loadPostDetail();
      } else message.error('发布评论失败，请稍后重试');
    } catch {
      message.error('发布评论失败，请稍后重试');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleScrollToComment = () => {
    commentAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => document.querySelector('textarea')?.focus(), 400);
  };

  if (loading)
    return (
      <PageContainer>
        <Spin tip="加载中..." />
      </PageContainer>
    );

  if (!data)
    return (
      <PageContainer>
        <div style={{ padding: 24 }}>
          <p>帖子不存在或已被删除。</p>
          <a onClick={() => history.push('/forum')}>返回论坛</a>
        </div>
      </PageContainer>
    );

  const { post, comments } = data;

  return (
    <PageContainer
      childrenContentStyle={{ padding: 8, marginTop: 0 }}
      header={{ title: post.title, breadcrumb: {}, onBack: () => history.goBack() }}
    >
      <ContentWrapper>
        <PostContent post={post} liked={liked} />

        <CommentList comments={comments as API.CommentTree[]} onReply={handleReply} />

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
