import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";

export const ExportToExcel = ({ apiData, fileName }) => {
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(apiData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Button variant="primary" onClick={(e) => exportExcel(apiData, fileName)}>
      Download (.xlsx)
    </Button>
  );
};
