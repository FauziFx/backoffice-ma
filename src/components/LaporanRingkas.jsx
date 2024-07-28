import React, { useState, useMemo } from "react";
import { Table } from "react-bootstrap";
import { FormatRupiah } from "@arismun/format-rupiah";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { ExportToExcelMultiple } from "../utils/ExportToExcelMultiple";

function LaporanRingkas({
  data,
  dataGrosir,
  dataMagrup,
  dataMagrupTotal,
  startDate,
  endDate,
}) {
  const [dataMagrupExport, setDataMagrupExport] = useState();
  const [fileName, setFileName] = useState("");
  const setData = useMemo(() => {
    const customHeadings = dataMagrup.map((item, i) => ({
      No: i + 1,
      "Nama Optik": item.nama_pelanggan,
      "Biaya Lab": item.total,
    }));
    customHeadings.push({
      "Nama Optik": "TOTAL",
      "Biaya Lab": dataMagrupTotal,
    });
    setDataMagrupExport(customHeadings);
    let r = (Math.random() + 1).toString(36).substring(7);
    const name =
      "Ma Bahagia-" +
      moment(startDate).format("DDMMYYYY") +
      "-" +
      moment(endDate).format("DDMMYYYY") +
      "-" +
      r;
    setFileName(name);
  }, [data, startDate, endDate]);
  return (
    <>
      <div className="text-end mb-2">
        <ExportToExcelMultiple
          dataGrosir={dataGrosir}
          dataMagrup={dataMagrupExport}
          fileName={fileName}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th
              className="bg-lightgrey"
              style={{ height: "40px" }}
              colSpan={2}
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-0 text-grey">Penjualan</td>
            <td className="text-end border-0 text-grey">
              <FormatRupiah value={data.totalPenjualan} />
            </td>
          </tr>
          <tr>
            <td className="border-0 text-grey">MA Grup</td>
            <td className="text-end border-0 text-grey">
              (
              <FormatRupiah value={data.totalMaGrup} />)
            </td>
          </tr>
          <tr>
            <td className="border-bottom border-black text-grey">Refund</td>
            <td className="border-bottom border-black text-end text-grey">
              <FormatRupiah value={data.totalRefund} />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th className="fw-bold border-0">Total</th>
            <th className="fw-bold border-0 text-end">
              <FormatRupiah value={data.total} />
            </th>
          </tr>
        </tfoot>
      </Table>

      <Table>
        <thead>
          <tr>
            <th className="bg-lightgrey" style={{ height: "40px" }} colSpan={2}>
              Metode Pembayaran
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-0 text-grey">Tunai</td>
            <td className="text-end border-0 text-grey">
              <FormatRupiah value={data.tunai} />
            </td>
          </tr>
          <tr>
            <td className="border-0 text-grey">Transfer</td>
            <td className="text-end border-0 text-grey">
              <FormatRupiah value={data.transfer} />
            </td>
          </tr>
          <tr>
            <td className="border-0 text-grey">Qris</td>
            <td className="text-end border-0 text-grey">
              <FormatRupiah value={data.qris} />
            </td>
          </tr>
          <tr>
            <td className="text-grey">EDC</td>
            <td className="text-end text-grey">
              <FormatRupiah value={data.edc} />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th className="fw-bold border-0">Total</th>
            <th className="fw-bold border-0 text-end">
              <FormatRupiah value={data.total} />
            </th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

export default LaporanRingkas;
