import { ProFormGroup, ProFormSwitch, ProCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

interface NoteCardProps {
  courseId?: number; // 可选的课程ID
  courseCode?: string; // 可选的课程代码
  courseTitle?: string; // 可选的课程标题
  courseTooltip?: string; // 可选的课程描述
  notes?: API.Note[]; // 可选的笔记数据
}

const CourseCard: React.FC<NoteCardProps> = ({ courseId, courseTitle, courseCode, courseTooltip, notes}) => {
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
        <Typography.Text
          style={{ display: 'block', width: 200 }} // 根据你的布局调整宽度
          ellipsis
        >
          {courseTitle}
        </Typography.Text>
      }
      tooltip={courseTooltip}
      defaultCollapsed
      collapsible
      boxShadow
      bordered
      hoverable
      gutter={[0, 4]}
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
          onClick={() => window.open(note?.link, '_blank')}
          style={{ cursor: 'pointer' }}
          >
          <Typography.Text
            style={{ display: 'block', width: '100%' }}
            ellipsis
          >
            {note.title}
          </Typography.Text>
        </ProCard>
      ))}
      
    </ProCard>

  );
};

export default CourseCard;
