import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="无权限访问"
    subTitle="抱歉，为保护他人链接安全，非会员用户只能访问官方笔记链接，发布一个笔记（不需要等审核通过）成为会员用户即可访问他人笔记链接。
    发布完笔记后刷新一下页面即可获得权限。"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoFoundPage;
