import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, message, Empty, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
//import styles from './Welcome.less';
import CourseCard from '@/components/NoteCard';
import { useModel } from 'umi';
import { ProCard } from '@ant-design/pro-components';
import AddNote from './components/addNote';

import React, { useEffect, useState } from 'react';
import { currentNotes } from '@/services/ant-design-pro/api';

const Notes: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [categoryCourses, setCategoryCourses] = useState<Record<string, API.CategoryCourse>>({});
  const [pinnedCourses, setPinnedCourses] = useState<API.CategoryCourse['courseNotes'][0][]>([]);
  const userName = initialState?.currentUser?.userName;
  const userId = initialState?.currentUser?.id;

  // 当组件加载时，获取当前用户的笔记数据
  useEffect(() => {
    if (!userId) {
      message.error('未获取到用户信息，无法加载笔记');
      return;
    }
    currentNotes({ data: {userId: userId, }})
      .then((res) => {
        if (res) {
          setCategoryCourses(res);
        } else {
          message.error("notes接口返回数据为空");
          console.error('接口返回错误：', );
        }
      })
      .catch((err) => {
        message.error("获取笔记数据失败");
        console.error('调用失败：', err);
      });
  }, [userId]);

  // 当 categoryCourses 变化时，去获取已标记的课程， 置顶
  useEffect(() => {
    const allCourses = Object.values(categoryCourses)
      .flatMap((cat) => cat.courseNotes || []);
    const pinned = allCourses.filter((course) => {
      const storageKey = `card_pinned_${course.courseId}`;
      return localStorage.getItem(storageKey) === 'true';
    });
    setPinnedCourses(pinned);
  }, [categoryCourses]);

    // 3. 如果想要固定顺序渲染：
  // const order = ['IT', 'AI', 'DS', 'CB', 'EE', 'other'] as const;
  // // 把 map 转成数组，并去掉不存在的项
  // const orderedCategoryCourses = order
  // .map((key) => categoryCourses[key])
  // .filter((c): c is API.CategoryCourse => !!c);

  // 或者不固定顺序
  const orderedCategoryCourses = Object.values(categoryCourses);

  return (
    <PageContainer>
      <Card>
        <Alert
          message={`这里是课程笔记导航栏，${userName+'同学' || '同学'}!`}
          type="success" // success,info,warning,error
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />

        {/* 顶部：已标记的课程 */}
        <ProCard
          title="已置顶课程"
          bordered
          collapsible
          defaultCollapsed={false}
          gutter={[12, 12]}
          tooltip="置顶后需重新加载页面才能生效（点进其他页面再跳转回来，或刷新）"
          extra={
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
                >
                  点击刷新
                </Button>
              }
          style={{ marginBottom: 24 }}
        >
          {pinnedCourses.length > 0 ? (
            pinnedCourses.map((course) => (
              <ProCard
                key={`pinned-${course.courseId}`}
                colSpan={{ xs: 24, sm: 12, md: 8, lg: 6 }}
                bodyStyle={{ padding: 0 }}
              >
                <CourseCard
                  courseId={course.courseId}
                  courseCode={course.code}
                  courseTitle={course.title}
                  courseTooltip={course.toolTip}
                  notes={course.noteList || []}
                />
              </ProCard>
            ))
          ) : (
            <Empty description="暂无置顶课程笔记" style={{ width: '100%' }} />
          )}
        </ProCard>

        <Typography.Text strong>
          {orderedCategoryCourses.map((category) => (
            <ProCard 
            gutter={[16,16]} 
            title={category.categoryTitle} 
            bordered 
            defaultCollapsed
            collapsible
            wrap 
            extra={<AddNote userId={userId}/>}
            tooltip={category.toolTip}
            subTitle={category.subTitle}
            >
              {(category.courseNotes || []).map((course) => (
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
          ))}
        </Typography.Text>
        <br />
      </Card>
    </PageContainer>
  );
};

export default Notes;
