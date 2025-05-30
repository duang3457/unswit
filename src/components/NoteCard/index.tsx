import { ProFormGroup, ProFormSwitch, ProCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

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
      title={courseTitle}
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
              checkedChildren={'标记'}
              unCheckedChildren={'未标'}
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
          <a>
            {note?.title}
          </a>
        </ProCard>
      ))}
      
    </ProCard>

  );
};

export default CourseCard;
