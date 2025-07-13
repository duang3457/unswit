import React, { useRef, useState } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';

const Sidebar = styled.div<{ right: number; bottom: number }>`
  position: fixed;
  right: ${({ right }) => right}px;
  bottom: ${({ bottom }) => bottom}px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 100;
  cursor: grab;
  user-select: none;
  @media (max-width: 900px) {
    right: ${({ right }) => Math.min(right, 8)}px;
    bottom: ${({ bottom }) => Math.min(bottom, 80)}px;
  }
`;

const SidebarButton = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

interface SidebarActionsProps {
  onScrollToTop: () => void;
  onScrollToComment: () => void;
}

const SidebarActions: React.FC<SidebarActionsProps> = ({ onScrollToTop, onScrollToComment }) => {
  const [position, setPosition] = useState({ right: 32, bottom: 120 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, right: 32, bottom: 120 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      right: position.right,
      bottom: position.bottom,
    };
    document.body.style.userSelect = 'none';
  };

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      // 计算新位置，防止超出窗口
      const newRight = Math.max(0, dragStart.current.right - dx);
      const newBottom = Math.max(0, dragStart.current.bottom - dy);
      setPosition({
        right: newRight,
        bottom: newBottom,
      });
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [position]);

  return (
    <Sidebar
      right={position.right}
      bottom={position.bottom}
      onMouseDown={onMouseDown}
      title="拖动移动按钮"
    >
      <SidebarButton type="primary" shape="circle" onClick={onScrollToTop} title="返回顶部">
        <CaretUpFilled />
      </SidebarButton>
      <SidebarButton type="primary" shape="circle" onClick={onScrollToComment} title="发表评论">
        <CaretDownFilled />
      </SidebarButton>
    </Sidebar>
  );
};

export default SidebarActions;
