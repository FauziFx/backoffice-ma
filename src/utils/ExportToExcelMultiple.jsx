import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";

export const ExportToExcelMultiple = ({
  dataGrosir,
  dataEceran,
  dataMagrup,
  dataTotal,
  fileName,
}) => {
  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const wsGrosir = XLSX.utils.json_to_sheet(dataGrosir);
    const wsEceran = XLSX.utils.json_to_sheet(dataEceran);
    const wsMagrup = XLSX.utils.json_to_sheet(dataMagrup);
    const wsTotal = XLSX.utils.json_to_sheet(dataTotal);
    XLSX.utils.book_append_sheet(workbook, wsGrosir, "GROSIR");
    XLSX.utils.book_append_sheet(workbook, wsEceran, "ECERAN");
    XLSX.utils.book_append_sheet(workbook, wsMagrup, "MAGRUP");
    XLSX.utils.book_append_sheet(workbook, wsTotal, "TOTAL");
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
      onClick={(e) =>
        exportExcel(dataGrosir, dataEceran, dataMagrup, dataTotal, fileName)
      }
    >
      Download (.xlsx)
    </Button>
  );
};
