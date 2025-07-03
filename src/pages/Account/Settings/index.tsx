// src/pages/account/setting/index.tsx
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Space, Divider, Button, Avatar, Tag } from 'antd';
import { BankOutlined, GithubOutlined, QqOutlined, WechatOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
  ProFormCaptcha,
  ProFormGroup,
} from '@ant-design/pro-form';
import type { FC } from 'react';

const mockUserInfo = {
  username: 'seratima',
  nickname: 'Serati Ma',
  email: 'serati.ma@example.com',
  phone: '13800000000',
};

const AccountSetting: FC = () => {
  const handleBasicSubmit = async (values: typeof mockUserInfo) => {
    console.log('提交个人信息：', values);
    // TODO: 调用接口更新用户基本信息
  };

  const handlePasswordSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    console.log('提交密码修改：', values);
    // TODO: 校验 oldPassword 是否正确，若正确则修改为 newPassword
  };

  const handleNotificationSubmit = async (values: {
    emailNotify: boolean;
    smsNotify: boolean;
    pushNotify: boolean;
  }) => {
    console.log('提交通知设置：', values);
    // TODO: 提交通知偏好
  };

  return (
    <PageContainer>
      <ProCard gutter={[16, 16]} direction="column">
        {/* 1. 个人信息设置 */}
        <ProCard title="个人信息设置" bordered>
          <ProForm
            layout="vertical"
            initialValues={mockUserInfo}
            submitter={{
              render: (props, doms) => {
                return <div style={{ textAlign: 'right' }}>{doms}</div>;
              },
            }}
            onFinish={handleBasicSubmit}
          >
            <ProFormText
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              rules={[
                { required: true, message: '用户名为必填项' },
                { min: 3, message: '用户名至少 3 个字符' },
              ]}
            />
            <ProFormText
              name="nickname"
              label="昵称"
              placeholder="请输入昵称"
              rules={[{ required: true, message: '昵称为必填项' }]}
            />
            <ProFormText
              name="email"
              label="邮箱"
              placeholder="请输入邮箱"
              rules={[
                { required: true, message: '邮箱为必填项' },
                { type: 'email', message: '请输入合法的邮箱地址' },
              ]}
            />
            <ProFormText
              name="phone"
              label="手机号"
              placeholder="请输入手机号"
              rules={[
                { required: true, message: '手机号为必填项' },
                {
                  pattern: /^\d{11}$/,
                  message: '请输入 11 位数字手机号',
                },
              ]}
            />
          </ProForm>
        </ProCard>

        {/* 2. 安全设置：修改密码 */}
        <ProCard title="安全设置" bordered>
          <ProForm
            layout="vertical"
            submitter={{
              render: (props, doms) => {
                return <div style={{ textAlign: 'right' }}>{doms}</div>;
              },
            }}
            onFinish={handlePasswordSubmit}
          >
            <ProFormText.Password
              name="oldPassword"
              label="旧密码"
              placeholder="请输入当前密码"
              rules={[{ required: true, message: '请输入当前密码' }]}
            />
            <ProFormText.Password
              name="newPassword"
              label="新密码"
              placeholder="请输入新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '新密码至少 6 个字符' },
              ]}
            />
            <ProFormText.Password
              name="confirmPassword"
              label="确认密码"
              placeholder="请再次输入新密码"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请再次输入新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            />
          </ProForm>
        </ProCard>

        {/* 3. 账号绑定 */}
        <ProCard title="账号绑定" bordered>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space align="center">
              <GithubOutlined style={{ fontSize: 24 }} />
              <span>Github</span>
              <Tag color="green">已绑定</Tag>
              <Button size="small">解除绑定</Button>
            </Space>
            <Space align="center">
              <QqOutlined style={{ fontSize: 24 }} />
              <span>QQ</span>
              <Tag color="default">未绑定</Tag>
              <Button type="primary" size="small">
                立即绑定
              </Button>
            </Space>
            <Space align="center">
              <WechatOutlined style={{ fontSize: 24 }} />
              <span>微信</span>
              <Tag color="default">未绑定</Tag>
              <Button type="primary" size="small">
                立即绑定
              </Button>
            </Space>
            <Space align="center">
              <BankOutlined style={{ fontSize: 24 }} />
              <span>支付宝</span>
              <Tag color="default">未绑定</Tag>
              <Button type="primary" size="small">
                立即绑定
              </Button>
            </Space>
          </Space>
        </ProCard>

        {/* 4. 新消息通知 */}
        <ProCard title="新消息通知" bordered>
          <ProForm
            layout="vertical"
            initialValues={{
              emailNotify: true,
              smsNotify: false,
              pushNotify: true,
            }}
            submitter={{
              render: (props, doms) => {
                return <div style={{ textAlign: 'right' }}>{doms}</div>;
              },
            }}
            onFinish={handleNotificationSubmit}
          >
            <ProFormSwitch
              name="emailNotify"
              label="邮件通知"
              fieldProps={{ checkedChildren: '开', unCheckedChildren: '关' }}
            />
            <ProFormSwitch
              name="smsNotify"
              label="短信通知"
              fieldProps={{ checkedChildren: '开', unCheckedChildren: '关' }}
            />
            <ProFormSwitch
              name="pushNotify"
              label="站内推送"
              fieldProps={{ checkedChildren: '开', unCheckedChildren: '关' }}
            />
          </ProForm>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default AccountSetting;
