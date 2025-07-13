import React from 'react';
import { Input, Button, Form } from 'antd';
import styled from 'styled-components';

interface CommentEditorProps {
  value: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  refAnchor?: React.RefObject<HTMLDivElement>;
}

const StyledForm = styled(Form)`
  margin: 32px 0 0 0;
  padding: 0;
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  text-align: left;
`;

const StyledTextArea = styled(Input.TextArea)`
  border-radius: 6px;
  font-size: 15px;
  resize: none;
`;

const StyledButton = styled(Button)`
  min-width: 96px;
`;

const CommentEditor: React.FC<CommentEditorProps> = ({
  value,
  loading,
  onChange,
  onSubmit,
  refAnchor,
}) => (
  <>
    <div ref={refAnchor} />
    <StyledForm layout="vertical" onFinish={onSubmit}>
      <StyledFormItem>
        <StyledTextArea
          rows={3}
          placeholder="写下你的评论..."
          value={value}
          onChange={onChange}
          maxLength={300}
          showCount
        />
      </StyledFormItem>
      <StyledFormItem>
        <StyledButton type="primary" htmlType="submit" loading={loading}>
          发表评论
        </StyledButton>
      </StyledFormItem>
    </StyledForm>
  </>
);

export default CommentEditor;
