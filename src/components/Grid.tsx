import React, { useRef } from 'react';

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
    backgroundColor: '#ff5722',
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

        return (
          <div
            key={index}
            style={{
              ...styles.cell,
              ...(dragging && isDraggedItem ? styles.dragover : {}),
            }}
            onMouseDown={(e) => itemIndex !== -1 && handleMouseDown(e, itemIndex)}
          >
            {itemIndex !== -1 && column === items[itemIndex].column && (
              <div
                style={{
                  ...styles.draggable,
                  width: `calc(15px * ${items[itemIndex].width} + 1px * ${items[itemIndex].width - 1})`,
                }}
              >
                <div style={styles.itemName}>{items[itemIndex].name}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
