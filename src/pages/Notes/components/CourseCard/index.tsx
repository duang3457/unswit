import { ProFormGroup, ProFormSwitch, ProCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import LikeButton from '@/pages/Notes/components/LikeButton';

interface NoteCardProps {
  userId?: string; // 可选的用户ID
  courseId?: number; // 可选的课程ID
  courseTitle?: string; // 可选的课程标题
  courseTooltip?: string; // 可选的课程描述
  notes?: API.Note[]; // 可选的笔记数据
  initialLikes: Record<number, number>; // 可选的初始点赞数
  initialLiked?: Record<number, boolean>; // 可选的初始点赞状态
}

const CourseCard: React.FC<NoteCardProps> = ({
  courseId,
  courseTitle,
  courseTooltip,
  notes,
  initialLiked = {},
  initialLikes,
  userId,
}) => {
  const storageKey = `card_pinned_${courseId}`;
  const [pinned, setPinned] = useState<boolean>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(pinned));
  }, [pinned]);

  return (
    <ProCard
      title={
        <Typography.Text style={{ display: 'block', width: '100%' }} ellipsis>
          {courseTitle}
        </Typography.Text>
      } // 超出部分省略
      tooltip={courseTooltip}
      defaultCollapsed // 默认折叠
      collapsible // 可折叠
      boxShadow // 卡片阴影
      bordered // 边框
      hoverable // 鼠标悬停时高亮
      gutter={[0, 4]} // 卡片间距
      layout="center"
      direction="column"
      extra={
        <ProFormGroup>
          <ProFormSwitch
            name="Visible"
            noStyle
            checkedChildren={'已置顶'}
            unCheckedChildren={'未置顶'}
            fieldProps={{
              checked: pinned,
              onChange: (checked) => setPinned(checked),
            }}
          />
        </ProFormGroup>
      }
    >
      {notes?.map((note) => (
        <ProCard
          layout="center"
          key={note?.id}
          hoverable
          title={
            <Typography.Text style={{ display: 'block', width: '100%' }} ellipsis>
              {note.title}
            </Typography.Text>
          }
          //headStyle={{ paddingTop: 4, paddingBottom: 4 }}
          bodyStyle={{ paddingTop: 0 }}
          tooltip={'【' + note.author + '】' + note?.toolTip || ''}
          onClick={() => window.open(note?.link, '_blank')}
          style={{ cursor: 'pointer' }}
        >
          {/* 点赞按钮：绝对定位到卡片右上角 */}
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <LikeButton
              userId={userId}
              noteId={note.id}
              initialCount={initialLikes[note.id]}
              initialLiked={initialLiked[note.id] || false}
            />
          </div>
        </ProCard>
      ))}
    </ProCard>
  );
};

export default CourseCard;
