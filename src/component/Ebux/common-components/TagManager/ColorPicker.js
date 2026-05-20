
import React, { useState } from "react";
const colorRows = [
  ['#e7f3fe', '#f3e8fd', '#fce8f6', '#fde8ec', '#fef0e0', '#fef7e0', '#eaf1e3', '#e6f4ea', '#e5f0db', '#d9ead3'],
  ['#c2e7ff', '#d7c7fb', '#f7c6e4', '#f9c1c5', '#fddbb0', '#feefc3', '#d3e3d3', '#c9e7d3', '#c6e2a9', '#b6d7a8'],
  ['#7fcfff', '#b7aefc', '#f38eb0', '#f28b82', '#fbc04e', '#fde293', '#a8dab5', '#94e2cd', '#b7e078', '#a3d37c'],
  ['#33b1ff', '#a186f7', '#ee7190', '#ea4335', '#f9ab00', '#fdd663', '#81c995', '#6fd6b0', '#b2d267', '#86c86a'],
  ['#0b78e3', '#944ce6', '#e34c76', '#dd3b30', '#f08100', '#fbd46d', '#57bb8a', '#34c48d', '#a4c936', '#66b447'],
  ['#0759b3', '#673ab7', '#c9134e', '#c5221f', '#de5b00', '#f5c302', '#3c9d72', '#1aa260', '#6fae00', '#3e8e41'],
  ['#0b4a91', '#4527a0', '#a50e3c', '#a50e0e', '#bf360c', '#dea806', '#2b7a57', '#0b8043', '#558b2f', '#2e7d32'],
  ['#093c75', '#311b92', '#8e0e35', '#8b0c0c', '#a33300', '#c59403', '#1e5631', '#076f3d', '#33691e', '#1b5e20'],
  ['#062b59', '#1a237e', '#6a0d29', '#6b0b0b', '#732600', '#a68002', '#163c20', '#065e2d', '#254e0d', '#0d470b'],
  ['#ffffff', '#bdbdbd', '#999999', '#666666', '#444444', '#2c2c2c', '#1a1a1a', '#0d0d0d', '#0d0d0d', '#000000'],
];
const styles = {
  title: {
    margin: '0 0 10px',
    fontSize: '18px'
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px'
  },
  row: {
    display: 'flex',
    gap: '4px'
  },
  cell: {
    width: '20px',
    height: '20px',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease-in-out'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  cancel: {
    background: 'white',
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  confirm: {
    background: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default function ColorPicker({ selectedColor, onColorChange }) {
  const [current, setCurrent] = useState(selectedColor);

  return (
    <div className="relative">
      <div className="absolute top-[40px] right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 w-70">

        <h3 style={styles.title}>Tag Color</h3>
        <div style={styles.grid}>
          {colorRows.map((row, rowIndex) => (
            <div key={rowIndex} style={styles.row}>
              {row.map((color, colIndex) => (
                <div
                  key={colIndex}
                  onClick={() => setCurrent(color)}
                  style={{
                    ...styles.cell,
                    backgroundColor: color,
                    border: current === color ? '3px solid #2196f3' : '1px solid #ccc'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={styles.actions}>
          <button onClick={() => onColorChange(selectedColor)} style={styles.cancel}>✕</button>
          <button onClick={() => onColorChange(current)} style={styles.confirm}>✔</button>
        </div>
      </div>
    </div>
  );
}