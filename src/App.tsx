import React, { useState } from 'react';
import Grid from './components/Grid';

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
};

const App = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState((60 / 5) * 8);

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
      <Grid rows={rows} columns={columns} />
    </div>
  );
};

export default App;
