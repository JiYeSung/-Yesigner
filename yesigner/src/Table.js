// src/Table.js
import React, { useState } from 'react';
import Grid from '@mui/material/Grid'; // Material-UI Grid 사용
import './Table.css'; // 테이블 스타일
import './Menu.css'; // 사이드바 스타일
import * as XLSX from 'xlsx'; // XLSX 라이브러리 임포트

const Table = () => {
    const rows = 5;
    const columns = 5;
  
    // 테이블 데이터를 상태로 관리
    const [tableData, setTableData] = useState(
      Array.from({ length: rows }, () => Array(columns).fill(''))
    );
  
    const handleInputChange = (rowIndex, colIndex, value) => {
      const newData = [...tableData];
      newData[rowIndex][colIndex] = value;
      setTableData(newData);
    };
  
    const handleKeyDown = (e, rowIndex, colIndex) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (colIndex < columns - 1) {
          document.getElementById(`input-${rowIndex}-${colIndex + 1}`).focus();
        } else if (rowIndex < rows - 1) {
          document.getElementById(`input-${rowIndex + 1}-0`).focus();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (colIndex === 0 && rowIndex > 0) {
          document.getElementById(`input-${rowIndex - 1}-${columns - 1}`).focus();
        } else if (colIndex > 0) {
          document.getElementById(`input-${rowIndex}-${colIndex - 1}`).focus();
        }
      } else if (e.key === 'ArrowDown' && rowIndex < rows - 1) {
        e.preventDefault();
        document.getElementById(`input-${rowIndex + 1}-${colIndex}`).focus();
      } else if (e.key === 'ArrowUp' && rowIndex > 0) {
        e.preventDefault();
        document.getElementById(`input-${rowIndex - 1}-${colIndex}`).focus();
      }
    };
  
    const exportToExcel = () => {
      const header = Array.from({ length: columns }, (_, index) => `Column ${index + 1}`);
      const dataToExport = [header, ...tableData];
  
      const worksheet = XLSX.utils.aoa_to_sheet(dataToExport);
  
      // 열 너비 설정
      const colWidths = header.map((_, index) => {
        const maxLength = Math.max(...dataToExport.map(row => row[index].toString().length));
        return { wch: maxLength + 2 };
      });
  
      worksheet['!cols'] = colWidths;
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
      XLSX.writeFile(workbook, 'table_data.xlsx');
    };
  
    return (
      <Grid container spacing={2}>
        <Grid item xs={2} className="sidebar">
          <h2>Menu</h2>
          <ul>
            <li>Menu 1</li>
            <li>Menu 2</li>
            <li>Menu 3</li>
          </ul>
        </Grid>
        <Grid item xs={10} className="table-container">
          <table>
            <thead>
              <tr>
                {Array.from({ length: columns }, (_, index) => (
                  <th key={index}>
                    <input
                      type="text"
                      defaultValue={`Column ${index + 1}`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }, (_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columns }, (_, colIndex) => (
                    <td key={colIndex}>
                      <input
                        id={`input-${rowIndex}-${colIndex}`}
                        type="text"
                        value={tableData[rowIndex][colIndex]}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportToExcel}>Download Excel</button>
        </Grid>
      </Grid>
    );
  };
  
  export default Table;