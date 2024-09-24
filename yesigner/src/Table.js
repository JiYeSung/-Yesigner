// src/Table.js
import React, { useState } from 'react';
import './Table.css'; // 스타일을 위한 CSS 파일
import './Menu.css'; // 추가된 메뉴 스타일을 위한 CSS 파일
import * as XLSX from 'xlsx'; // XLSX 라이브러리 임포트
import Grid from '@mui/material/Grid';

const Table = () => {
  const rows = 5; // 행 개수
  const columns = 5; // 열 개수

  // 테이블 데이터를 상태로 관리
  const [tableData, setTableData] = useState(
    Array.from({ length: rows }, () => Array(columns).fill(''))
  );

  const handleInputChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData]; // 기존 데이터 복사
    newData[rowIndex][colIndex] = value; // 새로운 값으로 업데이트
    setTableData(newData); // 상태 업데이트
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault(); // 기본 동작 방지
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
    const dataToExport = [header, ...tableData]; // 헤더와 테이블 데이터를 결합

    const worksheet = XLSX.utils.aoa_to_sheet(dataToExport); // 2D 배열을 워크시트로 변환

    // 열 너비 설정
    const colWidths = header.map((_, index) => {
      const maxLength = Math.max(...dataToExport.map(row => row[index].toString().length));
      return { wch: maxLength + 2 }; // 길이보다 약간 더 넓게 설정
    });

    worksheet['!cols'] = colWidths; // 워크시트에 열 너비 설정 추가

    const workbook = XLSX.utils.book_new(); // 새로운 워크북 생성
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // 워크시트 추가

    // 엑셀 파일 다운로드
    XLSX.writeFile(workbook, 'table_data.xlsx');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <div className="menu">
          <h2>Menu</h2>
          <ul>
            <li onClick={() => console.log('Menu 1 clicked')}>Menu 1</li>
            <li onClick={() => console.log('Menu 2 clicked')}>Menu 2</li>
            <li onClick={() => console.log('Menu 3 clicked')}>Menu 3</li>
          </ul>
        </div>
      </Grid>
      <Grid item xs={10}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {Array.from({ length: columns }, (_, index) => (
                  <th key={index}>
                    <input
                      type="text"
                      defaultValue={`Column ${index + 1}`}
                      onChange={(e) => handleInputChange(0, index, e.target.value)}
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
                        id={`input-${rowIndex}-${colIndex}`} // 고유 ID 설정
                        type="text"
                        value={tableData[rowIndex][colIndex]}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)} // 방향키 이벤트 추가
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportToExcel}>Download Excel</button> {/* 엑셀 다운로드 버튼 추가 */}
        </div>
      </Grid>
    </Grid>
  );
};

export default Table;