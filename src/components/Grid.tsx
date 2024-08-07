// Grid.tsx

import React, { useRef } from 'react';
import './Grid.css';

interface GridProps {
  rows: number;
  columns: number;
  items: { name: string; row: number; column: number; width: number; draggable: boolean }[];
  dragging: boolean;
  draggedItemIndex: number | null;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>, itemIndex: number) => void;
}

const Grid: React.FC<GridProps> = ({ rows, columns, items, dragging, draggedItemIndex, handleMouseDown }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cells = Array.from({ length: rows * columns });

  return (
    <div
      className="grid"
      ref={gridRef}
      style={{
        gridTemplateColumns: `repeat(${columns}, 15px)`,
        gridTemplateRows: `repeat(${rows}, 40px)`,
      }}
    >
      {cells.map((_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const itemIndex = items.findIndex(item =>
          item.row === row && column >= item.column && column < item.column + item.width
        );
        const isDraggedItem = itemIndex !== -1 && draggedItemIndex === itemIndex;

        return (
          <div
            key={index}
            className={`cell ${dragging && isDraggedItem ? 'dragover' : ''}`}
            onMouseDown={(e) => itemIndex !== -1 && handleMouseDown(e, itemIndex)}
          >
            {itemIndex !== -1 && column === items[itemIndex].column && (
              <div
                className={`draggable ${items[itemIndex].draggable ? '' : 'non-draggable'}`}
                style={{
                  width: `calc(15px * ${items[itemIndex].width} + 1px * ${items[itemIndex].width - 1})`,
                  transform: 'translate(0, -50%)',
                  boxSizing: 'border-box',
                }}
              >
                <div className="item-name">{items[itemIndex].name}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
