import React from "react";
import { Table } from "react-bootstrap";

function LaporanJenisPenjualan() {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th className="bg-lightgrey fw-bold">Jenis Penjualan</th>
            <th className="bg-lightgrey fw-bold">Transaksi</th>
            <th className="bg-lightgrey fw-bold text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-0 text-grey">Umum</td>
            <td className="border-0 text-grey">23</td>
            <td className="text-end border-0 text-grey">Rp 50.000.000</td>
          </tr>
          <tr>
            <td className="border-bottom border-black text-grey">MA Grup</td>
            <td className="border-bottom border-black text-grey">12</td>
            <td className="border-bottom border-black text-end text-grey">
              Rp 50.000.000
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th className="fw-bold" colSpan={2}>
              Total
            </th>
            <th className="fw-bold text-end">Rp 100.000.000</th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

export default LaporanJenisPenjualan;
