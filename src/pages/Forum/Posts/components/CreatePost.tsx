import React, { useState } from 'react';
import { Button, message } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormInstance,
} from '@ant-design/pro-components';
import { createPost as apiCreatePost } from '@/services/ant-design-pro/apis/postApi';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%; /* 如需撑满父容器高度 */
`;

const StyledButton = styled(Button)`
  margin-bottom: 16px;
  align-self: flex-start; /* 按钮左对齐 */
`;

interface CreatePostModalProps {
  onSuccess?: () => void;
}

const CreatePost: React.FC<CreatePostModalProps> = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = React.useRef<ProFormInstance>();

  // 抽屉关闭或点击右上角 X / 点击 Cancel 都会走这里
  const handleClose = () => {
    // form.resetFields(); 不在关闭时重置表单
    setIsOpen(false);
  };

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await apiCreatePost(values);
      message.success('帖子发布成功！');
      onSuccess?.();
      formRef.current?.resetFields(); // 发布成功后重置
      setIsOpen(false);
      return true; // 返回 true 会关闭抽屉
    } catch (e) {
      message.error('发布帖子失败，请稍后重试');
      return false; // 返回 false 不会关闭抽屉
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledButton type="primary" onClick={() => setIsOpen(true)} style={{ marginBottom: 16 }}>
        新建帖子
      </StyledButton>

      <DrawerForm
        title="新建帖子"
        open={isOpen}
        width={600}
        // 当 open 状态变化（关闭/打开）时回调
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        // 也可以在 drawerProps 里拦截右上角 X
        drawerProps={{
          forceRender: true,
          destroyOnClose: false, // 关闭时不卸载子组件,保持表单状态
          onClose: handleClose,
          width: '60%',
          // style: { display: 'flex' },
        }}
        formRef={formRef}
        onFinish={handleFinish}
        // 右下角的按钮配置
        submitter={{
          // 自定义
          searchConfig: {
            submitText: '发布',
            resetText: '重置',
          },
          // 发布
          submitButtonProps: {
            loading,
          },
          // 重置
          resetButtonProps: {
            onClick: () => formRef.current?.resetFields(),
          },
        }}
      >
        <ProFormText
          name="title"
          label="标题"
          rules={[
            { required: true, message: '请输入帖子标题' },
            { max: 50, message: '最多 50 字' },
          ]}
          fieldProps={{ placeholder: '请输入标题', maxLength: 50, showCount: true }}
        />
        <ProFormTextArea
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入帖子内容' }]}
          fieldProps={{ autoSize: { minRows: 8, maxRows: 15 } }}
        />
      </DrawerForm>
    </Container>
  );
};

export default CreatePost;
