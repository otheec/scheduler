// App.tsx

import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import './App.css';

function App() {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState((60 / 5) * 8);
  const [dragging, setDragging] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [items, setItems] = useState<{ name: string; row: number; column: number; width: number; draggable: boolean }[]>([
    { name: 'Item 1', row: 0, column: 0, width: 3, draggable: true },
    { name: 'Item 2', row: 1, column: 5, width: 2, draggable: true },
    { name: 'Item 3', row: 2, column: 5, width: 5, draggable: true },
    { name: 'Item 4', row: 3, column: 5, width: 7, draggable: true },
    { name: 'Item 5', row: 4, column: 5, width: 14, draggable: false },
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, itemIndex: number) => {
    if (!items[itemIndex].draggable) return;

    e.preventDefault();
    setDragging(true);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setDraggedItemIndex(itemIndex);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !dragStartPosition || draggedItemIndex === null) return;

    const cellWidth = 15 + 1; // 15px width + 1px gap
    const cellHeight = 40 + 1; // 40px height + 1px gap

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

  return (
    <div className="App">
      <div>
        <label>
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            min="1"
          />
        </label>
        <label>
          Columns:
          <input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <Grid
        rows={rows}
        columns={columns}
        items={items}
        dragging={dragging}
        draggedItemIndex={draggedItemIndex}
        handleMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default App;
