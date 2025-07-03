import { ProCard } from '@ant-design/pro-components';
import React from 'react';

// 暂时弃用
interface SingleNoteCardProps {
  note?: API.Note; // 可选的笔记数据
}

const SingleNoteCard: React.FC<SingleNoteCardProps> = ({ note }) => {
  return (
    <ProCard
      key={note?.id}
      hoverable
      onClick={() => window.open(note?.link, '_blank')}
      style={{ cursor: 'pointer' }}
    >
      <a>{note?.title}</a>
    </ProCard>
  );
};

export default SingleNoteCard;
