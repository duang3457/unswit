import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, List, Modal, Form, Input, Pagination, message } from 'antd';
import { history, request } from 'umi';
import { fetchPosts } from '@/services/ant-design-pro/api';
import { SoundTwoTone } from '@ant-design/icons';

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<API.BlogSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 从获取帖子列表
  const loadPosts = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetchPosts(page, pageSize);
      console.log('Fetched posts:', res);
      setPosts(res.blogs);
      setTotal(res.total);
    } catch (error) {
      message.error('加载帖子失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  // 创建新帖子
  const handleCreatePost = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        request<API.BlogSummary>('/api/posts', {
          method: 'POST',
          data: values,
        })
          .then(() => {
            message.success('帖子发布成功！');
            setIsModalVisible(false);
            form.resetFields();
            // 发布后刷新第一页
            setCurrentPage(1);
            fetchPosts(1);
          })
          .catch(() => {
            message.error('发布帖子失败，请稍后重试');
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((info) => {
        console.error('Validate Failed:', info);
      });
  };

  return (
    <PageContainer>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        新建帖子
      </Button>

      <List
        loading={loading}
        grid={{ gutter: 16, column: 1 }}
        dataSource={posts}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.title}
              extra={`${item.author} 发表/更新于 ${item.updateTime}`}
              hoverable
              onClick={() => history.push(`/forum/${item.id}`)}
            >
              <p>{item.content.slice(0, 50)}...</p>
            </Card>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={(page) => setCurrentPage(page)}
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
