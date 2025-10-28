import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
//import styles from './Welcome.less';
import { useModel } from 'umi';
import { ProCard } from '@ant-design/pro-components';

import React from 'react';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const userName = currentUser?.userName;

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
            <h3>写在前面</h3>
            <p>
              Hello, UNSWit 学习社区的朋友们！我们很高兴地宣布，UNSWit 学习社区正式上线啦！🎉
              <br />
              我们是普通的UNSW学IT的中国学生。我们希望通过这个平台，能够为大家提供一个友好、开放的学习环境，让每位成员在网站资源中有所收获，让每位成员都能在这里找到志同道合的伙伴，共同进步。
              <br />
              这里是一个专为UNSW学生和校友打造的学习交流平台，旨在帮助大家更好地学习和分享知识。无论你是新生还是老生，这里都有丰富的资源和热情的社区等着你来探索！
            </p>
            <h3>笔记区灵感（为什么要做笔记/资源分享平台）</h3>
            <p>
              俗话说得好：好记性不如烂笔头。一个好的学习方式是将自己在课上的输入，尝试在笔记中输出出来。
              同时，我们希望能够做出一个友好的学习圈子：因为今日你的笔记，就是明日他人的宝藏。
              虽然我们身处在不同的地方/教室/图书馆，但是我们的笔记可以将我们联系起来，
              从此，空阔的教室将不再只有你一个人，我们在学习路上将不再孤独，我们的留学生活要更加充实。
              <br />
              最后，让我们在笔下相遇，互相学习，共同进步。 Power! （口拙舌笨，词不达意，敬请谅解）
            </p>
            <h3>论坛区灵感（为什么要开个论坛，与小红书/微信的区别在哪里）</h3>
            <p />
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
