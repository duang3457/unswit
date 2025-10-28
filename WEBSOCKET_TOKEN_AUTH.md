# 🔐 WebSocket Token 认证方式说明

## 📋 更新概述

将 WebSocket 认证方式从 Cookie 改为 URL Token 参数。现在 Token 会直接附加在 WebSocket 连接 URL 中，方便后端解析。

## 🔧 技术实现

### 1. WebSocket 连接格式

```javascript
// 原来的 Cookie 方式,靠浏览器自己加cookie,遇到跨域就歇菜
ws://localhost:8080/chat

// 现在的 Token URL 方式  
ws://localhost:8080/chat?token=your_token_here
```

### 2. 前端实现更改

#### WebSocket 管理器 (`src/utils/websocket.ts`)
```typescript
connect(token?: string): boolean {
  // 将token作为URL参数传递给后端
  let wsUrl = WS_URL;
  if (token) {
    wsUrl += `?token=${encodeURIComponent(token)}`;
  } else {
    // 尝试从localStorage获取token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      wsUrl += `?token=${encodeURIComponent(storedToken)}`;
    }
  }
  
  this.ws = new WebSocket(wsUrl);
  // ...
}
```

#### React Hook 自动连接
```typescript
// 自动从localStorage读取token并连接
useEffect(() => {
  if (!isConnected && !loading && !connectionError) {
    const token = localStorage.getItem('token');
    if (token) {
      connect(token);
    }
  }
}, [isConnected, loading, connectionError, connect]);
```

### 3. Token 管理

- **存储位置**: `localStorage.getItem('token')`
- **设置方式**: 通过聊天页面的 Token 设置组件
- **自动连接**: 页面加载时自动读取并连接
- **手动更新**: 支持运行时修改 Token 并重新连接

## 🖥️ 用户界面

### Token 设置组件
- 首次访问时显示 Token 输入框
- 已设置 Token 时显示当前 Token 信息（部分隐藏）
- 支持修改 Token 功能
- 设置后自动尝试连接

### 连接状态指示
- 实时显示连接状态（已连接/未连接/连接中）
- 连接失败时显示详细错误信息
- 提供重新连接按钮

## 🌐 访问路径

| 页面 | 路径 | 功能 |
|------|------|------|
| **聊天室** | `/chat` | 基于Token认证的聊天系统 |
| **测试页面** | `/websocket-token-test.html` | Token认证测试工具 |

## 🧪 测试工具

### 静态测试页面
访问 `http://localhost:8000/websocket-token-test.html` 进行独立测试：

1. **输入参数**:
   - WebSocket 服务器地址: `ws://localhost:8080/chat`
   - 认证 Token: 您的用户令牌

2. **测试功能**:
   - 连接测试
   - Hello 消息发送
   - 普通消息发送
   - 连接日志查看

## 🔨 后端配置要求

### URL 参数解析
后端需要从 WebSocket 连接的 URL 中解析 `token` 参数：

```cpp
// C++ 示例
void onConnection(const muduo::net::TcpConnectionPtr& conn,
                 const muduo::net::HttpRequest& req) {
    // 解析URL查询参数
    std::string query = req.query();  // 获取 "token=user_token_123"
    std::string token;
    
    // 简单的参数解析
    size_t tokenPos = query.find("token=");
    if (tokenPos != std::string::npos) {
        size_t start = tokenPos + 6; // "token=" 长度
        size_t end = query.find("&", start);
        if (end == std::string::npos) end = query.length();
        token = query.substr(start, end - start);
        
        // URL 解码 token (如果需要)
        token = urlDecode(token);
    }
    
    // 验证token
    if (!validateToken(token)) {
        // 关闭连接
        conn->shutdown();
        return;
    }
    
    // token 验证成功，继续处理
    // ...
}
```

### 认证流程
1. **连接建立**: 客户端发起 WebSocket 连接，URL 包含 token 参数
2. **Token 提取**: 后端从 URL 查询参数中提取 token
3. **Token 验证**: 验证 token 的有效性和权限
4. **连接处理**: 
   - 验证成功：建立连接，返回用户信息和聊天室数据
   - 验证失败：关闭连接，返回错误信息

### 消息格式保持不变
```json
{
  "type": "hello|serverMessages|clientMessages",
  "payload": { /* 消息内容 */ }
}
```

## 🚀 使用流程

### 1. 开发者测试
1. 启动后端服务 (确保支持URL token解析)
2. 访问 `/websocket-token-test.html` 进行基础连接测试
3. 确认 token 认证流程正常工作

### 2. 用户使用
1. 访问 `/chat` 聊天页面
2. 在 Token 设置组件中输入认证令牌
3. 系统自动连接 WebSocket 并验证身份
4. 连接成功后开始聊天

### 3. Token 管理
- Token 存储在浏览器 localStorage 中
- 页面刷新后自动重新连接
- 支持随时修改 Token 并重新连接

## 🔍 调试建议

### 1. 连接问题
- 检查后端是否正确解析 URL 参数
- 确认 token 格式是否符合后端要求
- 查看浏览器网络面板的 WebSocket 连接详情

### 2. 认证问题  
- 验证 token 是否有效
- 检查后端认证逻辑
- 使用测试页面验证基础连接

### 3. 消息问题
- 确认连接状态为"已连接"
- 检查消息格式是否正确
- 查看后端日志确认消息接收

## 📝 与 Cookie 方式的对比

| 方面 | Cookie 方式 | Token URL 方式 |
|------|-------------|----------------|
| **实现复杂度** | 需要处理 Cookie 头 | 直接解析 URL 参数 |
| **调试便利性** | 需要设置浏览器 Cookie | 直接在 URL 中可见 |
| **安全性** | Cookie 自动发送 | 需要主动管理 |
| **跨域支持** | 可能受限制 | 更好的跨域支持 |
| **后端实现** | 解析 HTTP Cookie 头 | 解析 URL 查询参数 |

---
