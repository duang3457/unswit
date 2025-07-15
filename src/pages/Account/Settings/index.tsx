// src/pages/account/setting/index.tsx
import { useState } from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Space, Button, Tag, message } from 'antd';
// import { BankOutlined, GithubOutlined, QqOutlined, WechatOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormText, ProFormSwitch } from '@ant-design/pro-form';
import type { FC } from 'react';
import {
  updateUserBasicInfo,
  changeUserPassword,
  // currentUser,
} from '@/services/ant-design-pro/apis/userApi';

const AccountSetting: FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const userName = initialState?.currentUser?.userName;
  const userAccount = initialState?.currentUser?.userAccount;
  const email = initialState?.currentUser?.email;
  const phoneAU = initialState?.currentUser?.phoneAU;
  const phoneCN = initialState?.currentUser?.phoneCN;

  // optional: load current settings from backend
  const [initialBasic] = useState<any>({});
  const [initialNotify] = useState<any>({});

  const handleBasicSubmit = async (values: API.UserUpdateInfo) => {
    try {
      const user = await updateUserBasicInfo(values);
      // // 刷新当前用户：
      // const fresh = await currentUser({ credentials: 'include' });
      setInitialState((s) => ({ ...s!, currentUser: user }));
      message.success('个人信息已更新');
      return true;
    } catch (error: any) {
      message.error(error.message || '更新失败');
      return false;
    }
  };

  const handlePasswordSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const { oldPassword, newPassword } = values;
      await changeUserPassword({ oldPassword, newPassword });
      message.success('密码修改成功');
      return true;
    } catch (error: any) {
      message.error(error.message || '修改失败');
      return false;
    }
  };

  const handleNotificationSubmit = async (values: {
    emailNotify: boolean;
    smsNotify: boolean;
    pushNotify: boolean;
  }) => {
    try {
      // await updateUserNotification(values);
      message.success('通知设置暂时不可用');
      return true;
    } catch (error: any) {
      message.error(error.message || '保存失败');
      return false;
    }
  };

  return (
    <PageContainer>
      <ProCard gutter={[16, 16]} direction="column">
        <ProCard title="个人信息设置" bordered>
          <ProForm
            layout="vertical"
            initialValues={initialBasic}
            submitter={{
              render: (_, doms) => <div style={{ textAlign: 'right' }}>{doms}</div>,
            }}
            onFinish={handleBasicSubmit}
          >
            <ProFormText
              name="userAccount"
              label="用户名（登录用）"
              placeholder="请输入用户名"
              initialValue={userAccount}
              rules={[
                { required: true, message: '用户名为必填项' },
                { min: 3, message: '用户名至少 3 个字符' },
              ]}
            />
            <ProFormText
              name="userName"
              label="昵称（显示用）"
              initialValue={userName}
              placeholder="请输入昵称"
            />
            <ProFormText
              name="email"
              label="邮箱"
              initialValue={email}
              placeholder="请输入邮箱"
              rules={[{ type: 'email', message: '请输入合法的邮箱地址' }]}
            />
            <ProFormText
              name="phoneCN"
              label="国内手机号"
              initialValue={phoneCN}
              placeholder="请输入手机号"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入 11 位数字手机号(请检查是否输入正确)' },
              ]}
            />
            <ProFormText
              name="phoneAU"
              label="澳洲手机号"
              initialValue={phoneAU}
              placeholder="请输入手机号"
              rules={[{ pattern: /^04\d{8}$/, message: '请输入 10 位数字手机号(04开头)' }]}
            />
          </ProForm>
        </ProCard>

        <ProCard title="安全设置" bordered>
          <ProForm
            layout="vertical"
            submitter={{
              render: (_, doms) => <div style={{ textAlign: 'right' }}>{doms}</div>,
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

        {/* <ProCard title="账号绑定" bordered>
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
              <Button type="primary" size="small">立即绑定</Button>
            </Space>
            <Space align="center">
              <WechatOutlined style={{ fontSize: 24 }} />
              <span>微信</span>
              <Tag color="default">未绑定</Tag>
              <Button type="primary" size="small">立即绑定</Button>
            </Space>
            <Space align="center">
              <BankOutlined style={{ fontSize: 24 }} />
              <span>支付宝</span>
              <Tag color="default">未绑定</Tag>
              <Button type="primary" size="small">立即绑定</Button>
            </Space>
          </Space>
        </ProCard> */}

        <ProCard title="新消息通知" bordered>
          <ProForm
            layout="vertical"
            initialValues={initialNotify}
            submitter={{
              render: (_, doms) => <div style={{ textAlign: 'right' }}>{doms}</div>,
            }}
            onFinish={handleNotificationSubmit}
          >
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
