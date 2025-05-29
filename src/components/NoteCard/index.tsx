import { ProFormGroup, ProFormSwitch, ProCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

interface NoteCardProps {
  title: string;
  tooltip?: string;
  links: { label: string; href: string }[];
  id: string; // 用于存储置顶状态的唯一标识
}

const NoteCard: React.FC<NoteCardProps> = ({ title, tooltip, links, id}) => {
  const storageKey = `card_pinned_${id}`;
  const [pinned, setPinned] = useState<boolean>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved === 'true'; // 默认 false
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(pinned));
  }, [pinned]);

  return (
    <ProCard
      title={title}
      tooltip={tooltip}
      defaultCollapsed
      collapsible
      gutter={[0, 6]}
      colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
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
      boxShadow
      bordered
      hoverable
      layout="center"
      direction="column"
      
    >
      {links.map((item, index) => (
        <ProCard 
          key={index} 
          hoverable 
          onClick={() => window.open(item.href, '_blank')}
          style={{ cursor: 'pointer' }}
          >
          <a href={item.href} target="__blank" rel="noopener noreferrer">
            {item.label}
          </a>
        </ProCard>
      ))}
    </ProCard>
  );
};

export default NoteCard;
