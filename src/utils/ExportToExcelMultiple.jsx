import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";

export const ExportToExcelMultiple = ({ dataGrosir, dataMagrup, fileName }) => {
  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const wsGrosir = XLSX.utils.json_to_sheet(dataGrosir);
    // const wsEceran = XLSX.utils.json_to_sheet(dataEceran);
    const wsMagrup = XLSX.utils.json_to_sheet(dataMagrup);
    XLSX.utils.book_append_sheet(workbook, wsGrosir, "GROSIR");
    // XLSX.utils.book_append_sheet(workbook, wsEceran, "ECERAN");
    XLSX.utils.book_append_sheet(workbook, wsMagrup, "MAGRUP");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Button
      variant="primary"
      onClick={(e) => exportExcel(dataGrosir, dataMagrup, fileName)}
    >
      Download (.xlsx)
    </Button>
  );
};
