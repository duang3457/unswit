import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, message, Empty, Button } from 'antd';
import { ReloadOutlined, FireTwoTone, ClockCircleTwoTone } from '@ant-design/icons';
import CourseCard from '@/pages/Notes/components/CourseCard';
import { useModel } from 'umi';
import { ProCard } from '@ant-design/pro-components';
import AddNote from './components/addNote';
import { fetchNoteLikes, currentNotes } from '@/services/ant-design-pro/apis/noteApi';

import React, { useEffect, useState, useMemo } from 'react';

const Notes: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const userName = initialState?.currentUser?.userName;
  const userId = initialState?.currentUser?.id;

  const [categoryCourses, setCategoryCourses] = useState<Record<string, API.CategoryCourse>>({});
  const [pinnedCourses, setPinnedCourses] = useState<API.CategoryCourse['courseNotes'][0][]>([]);
  const [initialLikes, setInitialLikes] = useState<Record<number, number>>({});
  const [initialLiked, setInitialLiked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    console.log('initialLikes 更新了');
  }, [initialLikes]);

  useEffect(() => {
    console.log('initialLiked 更新了');
  }, [initialLiked]);

  // 1. 拉取分类 & 课程 & 笔记
  useEffect(() => {
    if (!userId) {
      message.error('未获取到用户信息，无法加载笔记');
      return;
    }
    currentNotes({ data: { userId } })
      .then((res) => {
        if (res) setCategoryCourses(res);
        else message.error('notes 接口返回数据为空');
      })
      .catch(() => message.error('获取笔记数据失败'));
  }, [userId]);

  // 2. 置顶课程
  useEffect(() => {
    const allCourses = Object.values(categoryCourses).flatMap((cat) => cat.courseNotes || []);
    const pinned = allCourses.filter(
      (course) => localStorage.getItem(`card_pinned_${course.courseId}`) === 'true',
    );
    setPinnedCourses(pinned);
  }, [categoryCourses]);

  // 3. 批量获取所有笔记的点赞状态
  useEffect(() => {
    // 提取所有笔记 ID
    const allNotes = Object.values(categoryCourses)
      .flatMap((cat) => cat.courseNotes || [])
      .flatMap((course) => course.noteList || []); // 后续优化：增加查询限制，如分页（前端展示也要分页） .slice((page-1)*pageSize, page*pageSize);
    const ids = allNotes.map((n) => n.id);
    if (ids.length) {
      fetchNoteLikes({
        data: {
          noteIds: ids,
          userId: userId,
        },
      })
        .then(({ likes, likedByUser }) => {
          setInitialLikes(likes);
          setInitialLiked(likedByUser);
        })
        .catch(() => {
          message.error('获取点赞状态失败');
        });
    }
  }, [categoryCourses]);

  // 所有笔记列表
  const allNotesList = useMemo(() => {
    return Object.values(categoryCourses)
      .flatMap((cat) => cat.courseNotes || [])
      .flatMap((course) => course.noteList || []);
  }, [categoryCourses]);

  // 最热笔记，按点赞数降序，取前5
  const hottestNotes = useMemo(() => {
    return [...allNotesList]
      .sort((a, b) => (initialLikes[b.id] || 0) - (initialLikes[a.id] || 0))
      .slice(0, 5);
  }, [allNotesList, initialLikes]);

  // 最新笔记，按创建时间降序，取前5
  const latestNotes = useMemo(() => {
    return [...allNotesList]
      .sort((a, b) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime())
      .slice(0, 5);
  }, [allNotesList]);

  // 不固定顺序
  const orderedCategoryCourses = Object.values(categoryCourses);

  return (
    <PageContainer>
      <Card>
        <Alert
          message={`${userName + '同学' || '同学'}，这里是课程笔记导航栏!`}
          description={
            <div>
              俗话说得好：好记性不如烂笔头。一个好的学习方式是将自己在课上的输入，尝试在笔记中输出出来。
              同时，我们希望能够做出一个友好的学习圈子：因为今日你的笔记，就是明日他人的宝藏。
              虽然我们身处在不同的地方/教室/图书馆，但是我们的笔记可以将我们联系起来，
              从此，空阔的教室将不再只有你一个人，我们在学习路上将不再孤独，我们的留学生活要更加充实。
              <br />
              最后，让我们在笔下相遇，互相学习，共同进步。 Power! （口拙舌笨，词不达意，敬请谅解）
            </div>
          }
          type="success" // success,info,warning,error
          showIcon
          banner
          closable
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />

        <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
          {/* 最热笔记列表 */}
          <ProCard
            title="最热笔记"
            bordered
            bodyStyle={{ padding: 2 }}
            style={{ marginBottom: 24 }}
          >
            {hottestNotes.length > 0 ? (
              hottestNotes.map((note) => (
                <Card key={note.id} size="small" style={{ marginBottom: 0 }} bordered={false}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start', // 整个容器顶部对齐
                      width: '100%',
                    }}
                  >
                    {/* 左侧：标题块，占满剩余空间，居中 */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center', // 水平居中
                        paddingRight: 8, // 避免和右侧内容贴太紧
                      }}
                    >
                      <Typography.Text
                        strong
                        underline
                        ellipsis
                        style={{ textAlign: 'center', width: '100%' }}
                      >
                        <Typography.Link href={note.link} target="_blank">
                          {note.title}
                        </Typography.Link>
                      </Typography.Text>
                    </div>

                    {/* 右侧：热度 & 时间 */}
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12, whiteSpace: 'nowrap' }}
                    >
                      <FireTwoTone twoToneColor="#eb2f96" /> {(initialLikes[note.id] || 0) * 100}
                    </Typography.Text>
                  </div>
                </Card>
              ))
            ) : (
              <Empty description="暂无最热笔记" />
            )}
          </ProCard>

          {/* 最新笔记列表 */}
          <ProCard
            title="最新笔记"
            bordered
            bodyStyle={{ padding: 2 }}
            style={{ marginBottom: 24 }}
          >
            {latestNotes.length > 0 ? (
              latestNotes.map((note) => (
                <Card key={note.id} size="small" style={{ marginBottom: 0 }} bordered={false}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start', // 整个容器顶部对齐
                      width: '100%',
                    }}
                  >
                    {/* 左侧：标题块，占满剩余空间，居中 */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center', // 水平居中
                        paddingRight: 8, // 避免和右侧内容贴太紧
                      }}
                    >
                      <Typography.Text
                        strong
                        underline
                        ellipsis
                        style={{ textAlign: 'center', width: '100%' }}
                      >
                        <Typography.Link href={note.link} target="_blank">
                          {note.title}
                        </Typography.Link>
                      </Typography.Text>
                    </div>

                    {/* 右侧： 时间 */}
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12, whiteSpace: 'nowrap' }}
                    >
                      <ClockCircleTwoTone />
                      {note.createTime &&
                        new Date(note.createTime).toLocaleDateString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                        })}
                    </Typography.Text>
                  </div>
                </Card>
              ))
            ) : (
              <Empty description="暂无最新笔记" />
            )}
          </ProCard>
        </div>

        {/* 顶部：已标记的课程 */}
        <ProCard
          title="已置顶课程"
          bordered
          wrap
          collapsible
          defaultCollapsed={false}
          gutter={[12, 12]}
          tooltip="置顶后需重新加载页面才能生效（点进其他页面再跳转回来，或刷新）"
          extra={
            <Button type="link" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
              点击刷新
            </Button>
          }
          style={{ marginBottom: 24 }}
        >
          {pinnedCourses.length > 0 ? (
            pinnedCourses.map((course) => (
              <ProCard
                key={`pinned-${course.courseId}`}
                colSpan={{ xs: 24, sm: 24, md: 12, lg: 12 }}
                bodyStyle={{ padding: 0 }}
              >
                <CourseCard
                  userId={userId}
                  courseId={course.courseId}
                  courseTitle={course.title}
                  courseTooltip={course.toolTip}
                  notes={course.noteList || []}
                  initialLikes={initialLikes}
                  initialLiked={initialLiked}
                />
              </ProCard>
            ))
          ) : (
            <Empty description="暂无置顶课程笔记" style={{ width: '100%' }} />
          )}
        </ProCard>

        {/* 分类课程 & 笔记列表 */}
        <Typography.Text strong>
          {orderedCategoryCourses.map((category) => (
            <ProCard
              gutter={[16, 16]}
              title={category.categoryTitle}
              bordered
              defaultCollapsed
              collapsible
              wrap
              extra={<AddNote userId={userId} />}
              tooltip={category.toolTip}
              subTitle={category.subTitle}
            >
              {(category.courseNotes || []).map((course) => (
                <ProCard colSpan={{ xs: 24, sm: 24, md: 12, lg: 12 }} bodyStyle={{ padding: 0 }}>
                  <CourseCard
                    userId={userId}
                    courseId={course.courseId}
                    courseTitle={course.title}
                    courseTooltip={course.toolTip}
                    notes={course.noteList || []}
                    initialLikes={initialLikes}
                    initialLiked={initialLiked}
                  />
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
