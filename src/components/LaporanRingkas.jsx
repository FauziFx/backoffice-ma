import React from "react";
import { Table } from "react-bootstrap";

function LaporanRingkas() {
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
            <td className="text-end border-0 text-grey">Rp 100.000.000</td>
          </tr>
          <tr>
            <td className="border-0 text-grey">MA Grup</td>
            <td className="text-end border-0 text-grey">(Rp 50.000.000)</td>
          </tr>
          <tr>
            <td className="border-bottom border-black text-grey">Refund</td>
            <td className="border-bottom border-black text-end text-grey">
              - Rp 1.000.000
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th className="fw-bold border-0">Total</th>
            <th className="fw-bold border-0 text-end">Rp 49.000.000</th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

export default LaporanRingkas;
