import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Divider, message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { PLANET_LINK, SYSTEM_LOGO } from '@/constants';
import Footer from '@/components/Footer';
import { login as apiLogin } from '@/services/ant-design-pro/apis/userApi';
import styles from './index.less';
import { Link } from '@umijs/preset-dumi/lib/theme';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    // 这里只是拿到数据，并没有更新到globalState中
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log('fetchUserInfo', userInfo);
    if (userInfo) {
      console.log(userInfo);
      // 需要在登录成功后，调用setInitialState来更新globalState
      // 这样就可以得到initialState.currentUser,不然还是老的值
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 有全局响应拦截器（位于plugins/globalRequest.ts），所以不需要在这里处理错误
      // 成功返回：API.BaseResponse.data(即登录返回的token)，隐藏掉了code,message,description部分
      const response = await apiLogin({ ...values, type });

      if (response) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);

        // 直接从登录响应中获取token并保存
        if (typeof response === 'string' && response.trim()) {
          localStorage.setItem('token', response);
          console.log('Token saved from login response:', response.substring(0, 20) + '***');
        }

        // 获取用户信息
        await fetchUserInfo();

        // 保存用户ID到localStorage用于WebSocket连接
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo && userInfo.id) {
          localStorage.setItem('userId', userInfo.id);
          console.log('UserId saved for WebSocket:', userInfo.id);
        }

        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        // 将当前页面的地址更改为 redirect 参数指定的路径（如果没有，则跳转到主页 '/'）。
        history.push(redirect || '/');
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="UNSWIT学习社区"
          subTitle={
            <a href={PLANET_LINK} target="_blank" rel="noreferrer">
              课程墙，吐槽墙，撕逼墙，表白墙开源社区（本网站github已开源）
            </a>
          }
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号密码登录'} />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的账号和密码'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入账号"
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 6,
                    type: 'string',
                    message: '长度不能小于 6',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Space split={<Divider type="vertical" />}>
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <Link to="/user/register">新用户注册</Link>
              <a
                style={{
                  float: 'right',
                }}
                href={PLANET_LINK}
                target="_blank"
                rel="noreferrer"
              >
                忘记密码请联系我们
              </a>
            </Space>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
