import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
//import styles from './Welcome.less';
import NoteCard from '@/components/NoteCard';
import { useModel } from 'umi';
import {
  ProCard,
  ProFormGroup,
  ProFormSwitch,
} from '@ant-design/pro-components';

// const CodePreview: React.FC = ({ children }) => (
//   <pre className={styles.pre}>
//     <code>
//       <Typography.Text copyable>{children}</Typography.Text>
//     </code>
//   </pre>
// );

// api{
//     {
        //    title="6713全套笔记" 
        //     tooltip="这是6713的笔记合集，包含了6713笔记和外部资源" 
        //     links={[
        //       { label: '[导航链接] 6713在线笔记-Yang', href: 'https://sudden-comic-c00.notion.site/1f1f45253452809daeaad72fceb2146f?v=1f1f45253452806fb07b000ce212e8c5&pvs=4' },
        //       { label: '6713笔记-XXX', href: 'https://sudden-comic-c00.notion.site/1f1f45253452809daeaad72fceb2146f?v=1f1f45253452806fb07b000ce212e8c5&pvs=4' },
        //     ]}
        //     id="6713" 
//     };
//     {
    //    title="6713全套笔记" 
            //     tooltip="这是6713的笔记合集，包含了6713笔记和外部资源" 
            //     links={[
            //       { label: '[导航链接] 6713在线笔记-Yang', href: 'https://sudden-comic-c00.notion.site/1f1f45253452809daeaad72fceb2146f?v=1f1f45253452806fb07b000ce212e8c5&pvs=4' },
            //       { label: '6713笔记-XXX', href: 'https://sudden-comic-c00.notion.site/1f1f45253452809daeaad72fceb2146f?v=1f1f45253452806fb07b000ce212e8c5&pvs=4' },
            //     ]}
            //     id="6713" 
//     };

// }

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
          <ProCard gutter={[8,8]} title="AI课" wrap bordered tooltip="AI课包含AI-stream系列课程，包括9444,9417,9517,6713,9414等">
          <NoteCard 
            title="6713全套笔记" 
            tooltip="这是6713的笔记合集，包含了6713笔记和外部资源" 
            links={[
              { label: '[导航链接] 6713在线笔记-Yang', href: 'https://sudden-comic-c00.notion.site/1f1f45253452809daeaad72fceb2146f?v=1f1f45253452806fb07b000ce212e8c5&pvs=4' },
              { label: '6713笔记-XXX', href: 'https://sudden-comic-c00.notion.site/1f1f45253452809daeaad72fceb2146f?v=1f1f45253452806fb07b000ce212e8c5&pvs=4' },
            ]}
            id="6713"
      
            >
          </NoteCard>
          
          <NoteCard
            title="9417全套笔记"
            tooltip="这是9417的笔记合集，包含了9417笔记和外部资源"
            links={[
              { label: '[导航链接] 9417在线笔记-Yang', href: "https://sudden-comic-c00.notion.site/1e8f45253452805d97d3ddf1e01f3e6b?v=1e8f4525345280268519000c45442a68&pvs=4" },
              { label: '9417笔记-XXX', href: 'https://sudden-comic-c00.notion.site/1e8f45253452805d97d3ddf1e01f3e6b?v=1e8f4525345280268519000c45442a68&pvs=4' },
            ]}
            id="9444"
          
            >
          </NoteCard>

          <NoteCard
            title="9101全套笔记"
            tooltip="这是9101的笔记合集，包含了9101笔记和外部资源"
            links={[
              { label: '[导航链接] 9101在线笔记-Yang', href: "https://sudden-comic-c00.notion.site/1e8f45253452805d97d3ddf1e01f3e6b?v=1e8f4525345280268519000c45442a68&pvs=4" },
              { label: '9101笔记-XXX', href: 'https://sudden-comic-c00.notion.site/1e8f45253452805d97d3ddf1e01f3e6b?v=1e8f4525345280268519000c45442a68&pvs=4' },
            ]}
            id="9101"
    
            >
          </NoteCard>

          </ProCard>
        </Typography.Text>
        <br />
        {/* <CodePreview>yarn add @ant-design/pro-table</CodePreview> */}
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
