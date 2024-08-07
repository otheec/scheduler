import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../model/Task';

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridGap: '1px',
    backgroundColor: 'grey',
    padding: '10px',
    border: '1px solid #ccc',
    marginTop: '20px',
  },
  cell: {
    width: '15px',
    height: '40px',
    textAlign: 'center',
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  draggable: {
    height: '40px',
    position: 'absolute',
    top: '50%',
    left: '0',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    transform: 'translateY(-50%)',
    boxSizing: 'border-box',
  },
  itemName: {
    flexGrow: 1,
    textAlign: 'center',
  },
  dragover: {
    backgroundColor: '#cfd8dc',
  },
};

interface GridProps {
  rows: number;
  columns: number;
  items: Task[];
  setItems: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Grid: React.FC<GridProps> = ({ rows, columns, items, setItems }) => {
  const [dragging, setDragging] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, itemIndex: number) => {
    if (!items[itemIndex].draggable) return;

    e.preventDefault();
    setDragging(true);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setDraggedItemIndex(itemIndex);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !dragStartPosition || draggedItemIndex === null) return;

    const cellWidth = 15 + 1;
    const cellHeight = 40 + 1;

    const offsetX = e.clientX - dragStartPosition.x;
    const offsetY = e.clientY - dragStartPosition.y;

    const halfCellWidth = cellWidth / 2;
    const halfCellHeight = cellHeight / 2;

    const newColumn = Math.min(
      columns - items[draggedItemIndex].width,
      Math.max(
        0,
        Math.floor((items[draggedItemIndex].column * cellWidth + offsetX + halfCellWidth) / cellWidth)
      )
    );

    const newRow = Math.min(
      rows - 1,
      Math.max(
        0,
        Math.floor((items[draggedItemIndex].row * cellHeight + offsetY + halfCellHeight) / cellHeight)
      )
    );

    // Check for overlap
    const overlaps = items.some((item, index) => {
      if (index === draggedItemIndex) return false;
      const itemEndColumn = item.column + item.width;
      const draggedEndColumn = newColumn + items[draggedItemIndex].width;
      return (
        item.row === newRow &&
        (
          (newColumn >= item.column && newColumn < itemEndColumn) ||
          (draggedEndColumn > item.column && draggedEndColumn <= itemEndColumn) ||
          (newColumn < item.column && draggedEndColumn > itemEndColumn)
        )
      );
    });

    if (!overlaps) {
      setItems(prevItems => {
        const newItems = [...prevItems];
        newItems[draggedItemIndex] = {
          ...newItems[draggedItemIndex],
          row: newRow,
          column: newColumn,
        };
        return newItems;
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStartPosition(null);
    setDraggedItemIndex(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const cells = Array.from({ length: rows * columns });

  return (
    <div
      ref={gridRef}
      style={{
        ...styles.grid,
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
        const item = items[itemIndex];

        return (
          <div
            key={index}
            style={{
              ...styles.cell,
              ...(dragging && isDraggedItem ? styles.dragover : {}),
            }}
            onMouseDown={(e) => itemIndex !== -1 && handleMouseDown(e, itemIndex)}
          >
            {itemIndex !== -1 && column === item.column && (
              <div
                style={{
                  ...styles.draggable,
                  width: `calc(15px * ${item.width} + 1px * ${item.width - 1})`,
                  backgroundColor: item.draggable ? 'green' : '#ff5722',
                }}
              >
                <div style={styles.itemName}>{item.name}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
