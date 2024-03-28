import React from "react";
import { Table } from "react-bootstrap";
import { FormatRupiah } from "@arismun/format-rupiah";

function LaporanRingkas({ data }) {
  return (
    <>
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
    </>
  );
}

export default LaporanRingkas;
