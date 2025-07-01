import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, List, Modal, Form, Input, Pagination, message } from 'antd';
import { history } from 'umi';
import {
  fetchPosts as apiFetchPosts,
  createPost as apiCreatePost,
} from '@/services/ant-design-pro/api';

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<API.BlogSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取并渲染帖子列表
  const loadPosts = async (page: number, size: number) => {
    setLoading(true);
    try {
      // 后端已支持分页参数 page & size
      const res = await apiFetchPosts(page, size);
      console.log('Fetched posts:', res);
      setPosts(res.blogSumList || []); // 确保有默认值，避免 undefined
      setTotal(res.total);
      // 如果后端返回 pageSize，可同步更新
      if (res.pageSize) setPageSize(res.pageSize);
      // 如果后端返回当前页，可同步更新
      if (res.page) setCurrentPage(res.page);
    } catch (error) {
      message.error('加载帖子失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // 创建新帖子并刷新列表
  const handleCreatePost = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await apiCreatePost(values);
      message.success('帖子发布成功！');
      setIsModalVisible(false);
      form.resetFields();
      // 发布后刷新列表，保留当前分页或跳回第一页：这里跳回第一页
      loadPosts(1, pageSize);
    } catch (error) {
      if ((error as any)?.errorFields) {
        // 表单校验错误，不处理
      } else {
        message.error('发布帖子失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        新建帖子
      </Button>

      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 16, column: 1 }}
        dataSource={posts}
        renderItem={(item) => {
          // 格式化为 月-日 时:分，例如 6-30 23:15
          const date = new Date(item.updateTime);
          const formatted = date.toLocaleString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          return (
            <List.Item>
              <Card
                title={item.title}
                extra={`${item.author} 发布于 ${formatted}`}
                hoverable
                onClick={() => history.push(`/forum/${item.id}`)}
              >
                <p>{item.content}</p>
              </Card>
            </List.Item>
          );
        }}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        style={{ marginTop: 16, textAlign: 'right' }}
      />

      <Modal
        title="新建帖子"
        visible={isModalVisible}
        confirmLoading={loading}
        onOk={handleCreatePost}
        onCancel={() => setIsModalVisible(false)}
        okText="发布"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入帖子标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入帖子内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ForumPage;
