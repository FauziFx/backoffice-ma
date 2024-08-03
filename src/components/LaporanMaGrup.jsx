import React, { useState, useMemo, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { FormatRupiah } from "@arismun/format-rupiah";
import { ExportToExcel } from "../utils/ExportToExcel";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function LaporanMaGrup({ data, totalItem, total, startDate, endDate }) {
  const [dataExport, setDataExport] = useState();
  const [fileName, setFileName] = useState("");
  const setData = useMemo(() => {
    const customHeadings = data.map((item, i) => ({
      No: i + 1,
      "Nama Optik": item.nama_pelanggan,
      "Biaya Lab": item.total,
    }));
    customHeadings.push({ "Nama Optik": "TOTAL", "Biaya Lab": total });
    setDataExport(customHeadings);
    let r = (Math.random() + 1).toString(36).substring(7);
    const name =
      "Ma Grup-" +
      moment(startDate).format("DDMMYYYY") +
      "-" +
      moment(endDate).format("DDMMYYYY") +
      "-" +
      r;
    setFileName(name);
  }, [data, startDate, endDate]);

  return (
    <>
      <Card className="mt-1">
        <Card.Body>
          <div className="text-end mb-2">
            <ExportToExcel apiData={dataExport} fileName={fileName} />
          </div>
          <Table responsive>
            <thead>
              <tr>
                <th className="bg-lightgrey fw-bold">Nama</th>
                <th className="bg-lightgrey fw-bold">Item Terjual</th>
                <th className="bg-lightgrey fw-bold text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="border-0 text-grey">{item.nama_pelanggan}</td>
                  <td className="border-0 text-grey">{item.item_terjual}</td>
                  <td className="text-end border-0 text-grey">
                    <FormatRupiah value={item.total} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-top">
              <tr>
                <th>Total</th>
                <th>{totalItem}</th>
                <th className="text-end pe-2">
                  <FormatRupiah value={total} />
                </th>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}

export default LaporanMaGrup;
