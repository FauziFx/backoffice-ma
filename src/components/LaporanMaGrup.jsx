import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FormatRupiah } from "@arismun/format-rupiah";

function LaporanMaGrup({ data, totalItem, total }) {
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
    </>
  );
}

export default LaporanMaGrup;
