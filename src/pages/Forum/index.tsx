import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography} from 'antd';
//import styles from './Welcome.less';
import { useModel } from 'umi';
import {
  ProCard
} from '@ant-design/pro-components';

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
          message={`UNSWit 学习社区欢迎你，${userName || '同学'}！`}
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
              这是论坛

            </p>
          </ProCard>
        </Typography.Text>
        <br />
 
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
        </Typography.Text>
     
      </Card>
    </PageContainer>
  );
};

export default Welcome;
