import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
//import styles from './Welcome.less';
import { useModel } from 'umi';
import { ProCard } from '@ant-design/pro-components';

import React from 'react';

// const CodePreview: React.FC = ({ children }) => (
//   <pre className={styles.pre}>
//     <code>
//       <Typography.Text copyable>{children}</Typography.Text>
//     </code>
//   </pre>
// );

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const userName = initialState?.currentUser?.userName;

  return (
    <PageContainer>
      <Card>
        <Alert
          message={`UNSWit 学习社区欢迎你，${userName || '某位不知名的同学'}！`}
          type="success" // success,info,warning,error
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <ProCard>
            <p>
              Hello, UNSWit 学习社区的朋友们！我们很高兴地宣布，UNSWit 学习社区正式上线啦！🎉
              <br />
              我们是普通的UNSW学IT的中国学生。我们希望通过这个平台，能够为大家提供一个友好、开放的学习环境，让每位成员在网站资源中有所收获，让每位成员都能在这里找到志同道合的伙伴，共同进步。
              <br />
              这里是一个专为UNSW学生和校友打造的学习交流平台，旨在帮助大家更好地学习和分享知识。无论你是新生还是老生，这里都有丰富的资源和热情的社区等着你来探索！
            </p>
          </ProCard>
        </Typography.Text>
        <br />

        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
         />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
