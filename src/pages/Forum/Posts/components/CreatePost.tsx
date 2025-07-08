import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { createPost as apiCreatePost } from '@/services/ant-design-pro/apis/postApi';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  margin-bottom: 16px;
`;
interface CreatePostModalProps {
  onSuccess?: () => void;
}

const CreatePost: React.FC<CreatePostModalProps> = ({ onSuccess }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCreatePost = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await apiCreatePost(values);
      message.success('帖子发布成功！');
      setIsModalVisible(false);
      form.resetFields();
      // 调用成功回调
      onSuccess?.();
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

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <StyledButton type="primary" onClick={() => setIsModalVisible(true)}>
        新建帖子
      </StyledButton>

      <Modal
        title="新建帖子"
        open={isModalVisible}
        confirmLoading={loading}
        onOk={handleCreatePost}
        onCancel={handleCancel}
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
    </>
  );
};

export default CreatePost;
