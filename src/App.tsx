import React, { useState } from 'react';
import Grid from './components/Grid';
import { Task } from './model/Task';
import { TaskService } from './service/TaskService';

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    height: '100vh',
  },
  input: {
    margin: '5px',
    padding: '5px',
  },
  button: {
    margin: '5px',
    padding: '10px',
    cursor: 'pointer',
  },
};

const App = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState((60 / 5) * 8 - 20);
  const [items, setItems] = useState<Task[]>([]);

  const handleFetchTasks = async () => {
    try {
      const tasks = await TaskService.getTasks();
      setItems(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div style={styles.app}>
      <div>
        <label>
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            min="1"
            style={styles.input}
          />
        </label>
        <label>
          Columns:
          <input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            min="1"
            style={styles.input}
          />
        </label>
      </div>
      <div>
        <button style={styles.button} onClick={handleFetchTasks}>
          Fetch Tasks
        </button>
      </div>
      <Grid rows={rows} columns={columns} items={items} setItems={setItems} />
    </div>
  );
};

export default App;
