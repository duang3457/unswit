import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, message } from 'antd';
//import styles from './Welcome.less';
import CourseCard from '@/components/NoteCard';
import { useModel } from 'umi';
import { ProCard } from '@ant-design/pro-components';
import AddNote from './components/addNote';

import React, { useEffect, useState } from 'react';
import { currentNotes } from '@/services/ant-design-pro/api';

const Notes: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [courses, setCourses] = useState<API.Course[]>([]);
  const userName = initialState?.currentUser?.userName;

  useEffect(() => {
    currentNotes()
      .then((res) => {
        if (res) {
          setCourses(res);
          console.log('获取到的笔记数据：', res);
        } else {
          message.error("notes接口返回数据为空");
          console.error('接口返回错误：', );
        }
      })
      .catch((err) => {
        message.error("获取笔记数据失败");
        console.error('调用失败：', err);
      });
  }, []);

  return (
    <PageContainer>
      <Card>
        <Alert
          message={`这里是课程笔记栏，${userName+'同学' || '同学'}!`}
          type="success" // success,info,warning,error
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <ProCard 
            gutter={[16,16]} 
            title="AI" 
            bordered 
            wrap 
            extra={<AddNote />}
            tooltip="AI课包含AI-stream系列课程，包括9444,9417,9517,6713,9414等" 
            subTitle="AI课程" 
            >
          {courses.map((course) => (
            <ProCard colSpan={{xs: 24, sm: 24, md: 12, lg: 12}} bodyStyle={{ padding: 0 }}>
            <CourseCard 
              courseId={course.courseId}
              courseCode={course.code} 
              courseTitle={course.title} 
              courseTooltip={course.toolTip} 
              notes = {course.noteList || []}
              >
            </CourseCard>
            </ProCard>

          ))}
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

export default Notes;
