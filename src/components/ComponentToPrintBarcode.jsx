import React, { forwardRef } from "react";
import Barcode from "react-barcode";

const ComponentToPrintBarcode = forwardRef(function MyInput(props, ref) {
  return (
    <>
      <div
        ref={ref}
        className="media-print bg-white"
        style={{
          width: "210mm",
          margin: "10px auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {props.dataPrint.map((item, index) => (
          <ComponentBarcode
            key={index}
            nama={item.nama}
            kode={item.kode}
            varian={item.nama_varian}
          />
        ))}
      </div>
    </>
  );
});

function ComponentBarcode({ nama, kode, varian }) {
  return (
    <table style={{ marginBottom: "15px" }}>
      <tbody>
        <tr>
          <td className="p-0 text-center" style={{ fontSize: "11px" }}>
            {nama}
          </td>
        </tr>
        <tr>
          <td className="p-0 text-center">
            <Barcode
              value={kode}
              height={20}
              width={1.5}
              fontSize={7}
              textMargin={1}
              displayValue={false}
              margin={1}
            />
          </td>
        </tr>
        <tr>
          <td className="p-0 text-center" style={{ fontSize: "11px" }}>
            {kode}&nbsp;{varian}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ComponentToPrintBarcode;
