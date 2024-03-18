import React from "react";
import { Table } from "react-bootstrap";

function LaporanKategoriPenjualan() {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th className="bg-lightgrey fw-bold">Kategori</th>
            <th className="bg-lightgrey fw-bold">Item Terjual</th>
            <th className="bg-lightgrey fw-bold text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-0 text-grey">Lensa</td>
            <td className="border-0 text-grey">23</td>
            <td className="text-end border-0 text-grey">Rp 50.000.000</td>
          </tr>
          <tr>
            <td className="border-bottom border-black text-grey">Frame</td>
            <td className="border-bottom border-black text-grey">12</td>
            <td className="border-bottom border-black text-end text-grey">
              Rp 50.000.000
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th className="fw-bold">Total</th>
            <th className="fw-bold">35</th>
            <th className="fw-bold text-end">Rp 100.000.000</th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

export default LaporanKategoriPenjualan;
