/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { history } from '@@/core/history';
import { stringify } from 'querystring';

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include',
  // prefix: process.env.NODE_ENV === 'production' ? 'http://XXX.XXX.XXX:XXXX' : undefined,
  // requestType: 'form',
});

/**
 * 所有请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  console.log(`do request url = ${url}`);

  // 检查是否是聊天相关请求，如果是则重定向到8082端口
  if (url.includes('/api/chat/')) {
    const chatUrl = url.replace(/^(https?:\/\/[^\/]+)?/, 'http://localhost:8082');
    console.log(`Redirecting chat request to: ${chatUrl}`);
    return {
      url: chatUrl,
      options: {
        ...options,
        headers: {
          ...options.headers,
          'X-Chat-Request': 'true',
        },
      },
    };
  }

  return {
    url,
    options: {
      ...options,
      headers: {},
    },
  };
});


/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response, options): Promise<any> => {
  const res = await response.clone().json();
  if (res.code === 0) {
    return res.data;
  } else if (res.code === 1) {
    message.success(res.description);
    return res.data;
  } else if (res.code === 40100) {
    message.error('请先登录');
    // 清除token
    localStorage.removeItem('token');
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: location.pathname,
      }),
    });
  } else {
    message.error(res.description);
  }
  return res.data;
});

export default request;
