// src/pages/account/center/index.tsx
import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Statistic, Tabs, message, Popconfirm } from 'antd';
import ProCard from '@ant-design/pro-card';
// import ProList from '@ant-design/pro-list';
import type { ActionType } from '@ant-design/pro-components';
import { ProList } from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import { history } from 'umi';

import {
  getUserStats,
  fetchNotes,
  fetchPosts,
  deletePost,
  deleteNote,
} from '@/services/ant-design-pro/apis/userApi';

const { Divider } = ProCard;
const { TabPane } = Tabs;

interface Stats {
  noteCount: number;
  postCount: number;
  noteLikeCount: number;
  postLikeCount: number;
}

const AccountCenter: React.FC = () => {
  // 1. 统计数据状态
  const [stats, setStats] = useState<Stats>({
    noteCount: 0,
    postCount: 0,
    noteLikeCount: 0,
    postLikeCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // 2. 响应式布局开关
  const [responsive, setResponsive] = useState<boolean>(false);

  const postAction = useRef<ActionType>();
  // 为笔记列表创建单独的 actionRef
  const noteAction = useRef<ActionType>();

  // 3. 组件挂载后手动拉取统计数据
  useEffect(() => {
    async function loadStats() {
      try {
        setStatsLoading(true);
        const data = await getUserStats(); // 你的 service 中封装了 request('/api/user/stats') 之类
        setStats({
          noteCount: data.noteCount,
          postCount: data.postCount,
          noteLikeCount: data.noteLikeCount,
          postLikeCount: data.postLikeCount,
        });
      } catch (err) {
        console.error('获取用户统计数据失败', err);
      } finally {
        setStatsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <PageContainer>
      {/* 统计数字 */}
      <ProCard>
        <RcResizeObserver
          key="resize-observer"
          onResize={({ width }) => setResponsive(width < 296)}
        >
          <ProCard.Group direction={responsive ? 'column' : 'row'}>
            <ProCard bodyStyle={{ padding: 0, textAlign: 'center' }} loading={statsLoading}>
              <Statistic title="笔记数" value={stats.noteCount} />
            </ProCard>
            <Divider type={responsive ? 'horizontal' : 'vertical'} />
            <ProCard bodyStyle={{ padding: 0, textAlign: 'center' }} loading={statsLoading}>
              <Statistic title="帖子数" value={stats.postCount} />
            </ProCard>
            <Divider type={responsive ? 'horizontal' : 'vertical'} />
            <ProCard bodyStyle={{ padding: 0, textAlign: 'center' }} loading={statsLoading}>
              <Statistic title="笔记被赞数" value={stats.noteLikeCount} />
            </ProCard>
            <Divider type={responsive ? 'horizontal' : 'vertical'} />
            <ProCard bodyStyle={{ padding: 0, textAlign: 'center' }} loading={statsLoading}>
              <Statistic title="帖子被赞数" value={stats.postLikeCount} />
            </ProCard>
          </ProCard.Group>
        </RcResizeObserver>
      </ProCard>

      {/* 列表区块：动态 / 我的笔记 / 我的帖子 */}
      <ProCard style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="1">
          {/* 动态
          <TabPane tab="动态" key="1">
          <ProList<API.MyPost>
              rowKey="id"
              pagination={{ pageSize: 5 }}
              request={async (params) => {
                const res = await fetchActivities({
                  current: params.current || 1,
                  pageSize: params.pageSize || 5,
                });
                return { data: res.data, total: res.total };
              }}
              metas={{
                title: { dataIndex: 'title' },
                description: { dataIndex: 'description' },
                subTitle: {
                  render: (_, item) => <>描述：{item.description}</>,
                },
                extra: {
                  render: (_, item) => (
                    <div style={{ textAlign: 'right', color: '#999' }}>
                      {item.updatedAt}
                    </div>
                  ),
                },
              }}
            />
          </TabPane> */}

          {/* 我的笔记 */}
          <TabPane tab="我的笔记" key="2">
            <ProList<API.MyNote>
              actionRef={noteAction}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              request={async (params) => {
                const res = await fetchNotes({
                  current: params.current || 1,
                  pageSize: params.pageSize || 5,
                });
                console.log('Fetched notes:', res);
                return { data: res.data, total: res.total };
              }}
              metas={{
                title: {
                  dataIndex: 'title',
                  render: (dom, item) => (
                    // <a href={item.href} target="_blank" rel="noreferrer">
                    <div>{item.title}</div>
                    // </a>
                  ),
                },
                // subTitle: { dataIndex: 'toolTips' },
                description: {
                  render: (_, item) => {
                    const d = new Date(item.updateTime);
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                      2,
                      '0',
                    )}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(
                      2,
                      '0',
                    )}时`;
                    return <>最后更新：{formatted}</>;
                  },
                },
                actions: {
                  render: (text, item) => [
                    <Popconfirm
                      key="delete"
                      title="确定要删除此笔记吗？"
                      onConfirm={async () => {
                        await deleteNote(item.id);
                        message.success('删除成功');
                        noteAction.current?.reload();
                      }}
                    >
                      <a>删除</a>
                    </Popconfirm>,
                  ],
                },
                // content:{
                //   dataIndex: 'description',
                //   render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
                // }
              }}
            />
          </TabPane>

          {/* 我的帖子 */}
          <TabPane tab="我的帖子" key="3">
            <ProList<API.MyPost>
              rowKey="id"
              actionRef={postAction}
              pagination={{ pageSize: 5 }}
              // 点击整行跳转到帖子详情
              onItem={(item) => ({
                onClick: () => history.push(`/forum/${item.id}`),
                style: { cursor: 'pointer' },
              })}
              request={async (params) => {
                const res = await fetchPosts({
                  current: params.current || 1,
                  pageSize: params.pageSize || 5,
                });
                console.log('Fetched notes:', res);
                return { data: res.data, total: res.total };
              }}
              metas={{
                title: {
                  dataIndex: 'title',
                  render: (dom, item) => <>{item.title}</>,
                },
                content: { dataIndex: 'content' },
                description: {
                  render: (_, item) => {
                    const d = new Date(item.updateTime);
                    const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                      2,
                      '0',
                    )}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(
                      2,
                      '0',
                    )}时`;
                    return <>最后更新：{formatted}</>;
                  },
                },
                actions: {
                  render: (text, item) => [
                    // <a key="edit" onClick={() => history.push(`/forum/${item.id}`)}>
                    //   编辑
                    //   </a>,
                    <a
                      key="copy"
                      onClick={() => {
                        const url = `${window.location.origin}/forum/${item.id}`;
                        navigator.clipboard.writeText(url);
                        message.success('已复制链接');
                      }}
                    >
                      复制
                    </a>,
                    <Popconfirm
                      key="delete"
                      title="确定要删除此帖子吗？"
                      onConfirm={async () => {
                        await deletePost(item.id);
                        message.success('删除成功');
                        postAction.current?.reload();
                      }}
                    >
                      <a>删除</a>
                    </Popconfirm>,
                  ],
                },
              }}
            />
          </TabPane>
        </Tabs>
      </ProCard>
    </PageContainer>
  );
};

export default AccountCenter;
