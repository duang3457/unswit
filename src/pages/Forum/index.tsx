import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, List, Modal, Form, Input, Pagination, message } from 'antd';
import { history } from 'umi';
import AddPost from './components/addPost';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const ForumPage: React.FC = () => {
  // 假数据
  const [posts, setPosts] = useState<Post[]>([
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
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleCreatePost = () => {
    form
      .validateFields()
      .then(values => {
        const newPost: Post = {
          id: posts.length + 1,
          title: values.title,
          content: values.content,
          author: 'CurrentUser', // 这里可以改为真实用户
          createdAt: new Date().toISOString().split('T')[0],
        };
        setPosts([newPost, ...posts]);
        setIsModalVisible(false);
        form.resetFields();
        message.success('帖子发布成功！');
      })
      .catch(info => {
        console.error('Validate Failed:', info);
      });
  };

  return (
    <PageContainer
      // header={{
      //   title: '论坛',
      //   breadcrumb: {},
      // }}
    >
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        新建帖子
      </Button>
      <AddPost/>

      <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            renderItem={item => (
                <List.Item>
                <Card
                    title={item.title}
                    extra={item.author + ' 发表于 ' + item.createdAt}
                    hoverable
                    onClick={() => {
                    history.push(`/forum/${item.id}`);
                    }}
                >
                    <p>{item.content.slice(0, 50)}...</p>
                </Card>
                </List.Item>
            )}
            />


      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={posts.length}
        onChange={page => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: 'right' }}
      />

      <Modal
        title="新建帖子"
        visible={isModalVisible}
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
