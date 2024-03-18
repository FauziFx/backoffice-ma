import React from "react";
import { Table, Button } from "react-bootstrap";

function LaporanMaGrup() {
  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th className="bg-lightgrey fw-bold">Nama</th>
            <th className="bg-lightgrey fw-bold">Item Terjual</th>
            <th className="bg-lightgrey fw-bold text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-0 text-grey">Ma Grup 1</td>
            <td className="border-0 text-grey">23</td>
            <td className="text-end border-0 text-grey">Rp 50.000.000</td>
          </tr>
          <tr>
            <td className="border-0 text-grey">Ma Grup 1</td>
            <td className="border-0 text-grey">23</td>
            <td className="text-end border-0 text-grey">Rp 50.000.000</td>
          </tr>
          <tr>
            <td className="border-0 text-grey">Ma Grup 1</td>
            <td className="border-0 text-grey">23</td>
            <td className="text-end border-0 text-grey">Rp 50.000.000</td>
          </tr>
          <tr>
            <td className="border-0 text-grey">Ma Grup 1</td>
            <td className="border-0 text-grey">23</td>
            <td className="text-end border-0 text-grey">Rp 50.000.000</td>
          </tr>
          <tr>
            <td className="border-bottom border-black text-grey">Ma Grup 2 </td>
            <td className="border-bottom border-black text-grey">12</td>
            <td className="border-bottom border-black text-end text-grey">
              Rp 50.000.000
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>634</th>
            <th className="text-end pe-4">Rp 150.000.000</th>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

export default LaporanMaGrup;
