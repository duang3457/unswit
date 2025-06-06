// src/pages/account/center/index.tsx
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Avatar, Statistic, Tabs, Space, Tag } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import type { FC } from 'react';
const { Divider } = ProCard;

const { TabPane } = Tabs;

import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';


interface UserInfo {
  name: string;
  avatar: string;
  userid: string;
  signature: string;
  tags: { key: string; label: string }[];
  title: string;
  group: string;
  geographic: { province: { label: string }; city: { label: string } };
  phone: string;
  email: string;
}

const mockActivities = Array.from({ length: 5 }).map((_, i) => ({
  id: i,
  title: `活动标题 ${i + 1}`,
  start: '2025-06-0' + (i + 1),
  updatedAt: `2025-05-2${i}`,
  description: '这是一段活动的描述……',
}));

const mockArticles = Array.from({ length: 5 }).map((_, i) => ({
  id: i,
  title: `示例文章 ${i + 1}`,
  href: 'https://ant.design',
  description: '这是一段文章的摘要……',
  updatedAt: `2025-05-2${i}`,
}));

const mockProjects = Array.from({ length: 5 }).map((_, i) => ({
  id: i,
  title: `项目名称 ${i + 1}`,
  href: 'https://github.com/',
  description: '项目简介……',
  updatedAt: `2025-05-2${i}`,
}));


const AccountCenter: FC = () => {
  const [responsive, setResponsive] = useState(false);
  return (
    <PageContainer>
   
        {/* 统计数字 */}
        <ProCard>
          <RcResizeObserver
            key="resize-observer"
            onResize={(offset) => {
                setResponsive(offset.width < 296);
            }}
            >
            <ProCard.Group direction={responsive ? 'column' : 'row'}>
                <ProCard bodyStyle={{ padding: 0 , textAlign: 'center'}}>
                <Statistic title="笔记数" value={79} />
                </ProCard>
                <Divider type={responsive ? 'horizontal' : 'vertical'} />
                <ProCard bodyStyle={{ padding: 0 , textAlign: 'center'}}>
                <Statistic title="帖子数" value={11} />
                </ProCard>
                <Divider type={responsive ? 'horizontal' : 'vertical'} />
                <ProCard bodyStyle={{ padding: 0 , textAlign: 'center'}}>
                <Statistic title="浏览量" value={93} />
                </ProCard>
                <Divider type={responsive ? 'horizontal' : 'vertical'} />
                <ProCard bodyStyle={{ padding: 0 , textAlign: 'center'}}>
                <Statistic title="点赞数" value={112} />
                </ProCard>
            </ProCard.Group>
            </RcResizeObserver>
        </ProCard>
 

      <ProCard style={{ marginTop: 16 }}>
        {/* Tab 切换：动态、文章、项目、应用 */}
        <Tabs defaultActiveKey="1">
          <TabPane tab="动态" key="1">
            <ProList<{ id: number; title: string; start: string; updatedAt: string; description: string }>
              rowKey="id"
              dataSource={mockActivities}
              metas={{
                title: {
                  dataIndex: 'title',
                  render: (dom, entity) => (
                    <a href="#!" style={{ fontWeight: 500 }}>
                      {entity.title}
                    </a>
                  ),
                },
                description: { dataIndex: 'description' },
                subTitle: {
                  render: (_, entity) => (
                    <span>
                      <span>开始时间：</span>
                      {entity.start}
                    </span>
                  ),
                },
                extra: {
                  render: (_, entity) => (
                    <div style={{ textAlign: 'right', color: '#999' }}>{entity.updatedAt}</div>
                  ),
                },
              }}
            />
          </TabPane>

          <TabPane tab="我的笔记" key="2">
            <ProList<{ id: number; title: string; href: string; description: string; updatedAt: string }>
              rowKey="id"

              dataSource={mockArticles}
              metas={{
                title: {
                  dataIndex: 'title',
                  render: (dom, entity) => (
                    <a href={entity.href} target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>
                      {entity.title}
                    </a>
                  ),
                },
                description: { dataIndex: 'description' },
                subTitle: {
                  render: (_, entity) => (
                    <span>
                      <span>最后更新：</span>
                      {entity.updatedAt}
                    </span>
                  ),
                },
              }}
            />
          </TabPane>

          <TabPane tab="我的帖子" key="3">
            <ProList<{ id: number; title: string; href: string; description: string; updatedAt: string }>
              rowKey="id"
              dataSource={mockProjects}
              metas={{
                title: {
                  dataIndex: 'title',
                  render: (dom, entity) => (
                    <a href={entity.href} target="_blank" rel="noreferrer" style={{ fontWeight: 500 }}>
                      {entity.title}
                    </a>
                  ),
                },
                description: { dataIndex: 'description' },
                subTitle: {
                  render: (_, entity) => (
                    <span>
                      <span>最后更新：</span>
                      {entity.updatedAt}
                    </span>
                  ),
                },
              }}
            />
          </TabPane>

          {/* <TabPane tab="应用" key="4">
            <ProList<{
              id: number;
              title: string;
              status: '待审批' | '已通过' | '未通过';
              updatedAt: string;
            }>
              rowKey="id"
              headerTitle="我的应用"
              dataSource={mockApplications}
              metas={{
                title: {
                  dataIndex: 'title',
                  render: (dom, entity) => (
                    <a href="#!" style={{ fontWeight: 500 }}>
                      {entity.title}
                    </a>
                  ),
                },
                subTitle: {
                  render: (_, entity) => {
                    let color: string;
                    if (entity.status === '已通过') color = 'green';
                    else if (entity.status === '待审批') color = 'orange';
                    else color = 'red';
                    return (
                      <Tag color={color} style={{ padding: '0 8px' }}>
                        {entity.status}
                      </Tag>
                    );
                  },
                },
                extra: {
                  render: (_, entity) => (
                    <div style={{ textAlign: 'right', color: '#999' }}>{entity.updatedAt}</div>
                  ),
                },
              }}
            />
          </TabPane> */}
        </Tabs>
      </ProCard>
    </PageContainer>
  );
};

export default AccountCenter;
