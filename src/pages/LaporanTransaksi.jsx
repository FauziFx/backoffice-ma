import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Dropdown,
  Table,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  Receipt,
  Search,
} from "react-bootstrap-icons";
import { addDays, format } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { FormatRupiah } from "@arismun/format-rupiah";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LaporanTransaksi() {
  const [showDetail, setShowDetail] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataDetail, setDataDetail] = useState({
    bayar: "",
    id_pelanggan: "",
    jenis_transaksi: "",
    kembalian: "",
    metode_pembayaran: "",
    nama_pelanggan: "",
    no_nota: "",
    status: "",
    tanggal: "",
    total: "",
    transaksi_detail: [
      {
        id_varian: "",
        nama_produk: "",
        nama_varian: "",
        qty: "",
        subtotal: "",
      },
    ],
  });

  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [dataTotal, setDataTotal] = useState({});
  const [jenisTransaksi, setJenisTransaksi] = useState("Jenis Transaksi");

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const increaseDate = () => {
    const startDate = addDays(state[0].startDate, 1);
    const endDate = addDays(state[0].endDate, 1);
    getDataLaporan(startDate, endDate);
    setState([
      {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
      },
    ]);
  };

  const decreaseDate = () => {
    const startDate = addDays(state[0].startDate, -1);
    const endDate = addDays(state[0].endDate, -1);
    getDataLaporan(startDate, endDate);
    setState([
      {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
      },
    ]);
  };

  const getDataLaporan = async (startDate, endDate, jenis_transaksi) => {
    try {
      moment.locale("id");
      const URL = API + "laporan/transaksi";
      const response = await axios.get(URL, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          // start_date: "2024-03-01",
          end_date: moment(endDate).format("YYYY-MM-DD"),
          jenis_transaksi: jenis_transaksi,
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setDataTransaksi(response.data.data);
        setDataTotal(response.data.data_total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickRow = async (id) => {
    try {
      const idTransaksi = id;
      const URL = API + "laporan/transaksi/" + idTransaksi;
      const response = await axios.get(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      setShowDetail(true);
      setDataDetail(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataLaporan(state.startDate, state.endDate);
  }, []);

  return (
    <Container className="pt-4 title-page">
      <Row className="p-2 text-white bg-primary shadow-sm mx-1">
        <Col className="pt-1">
          <h4 className="mb-0">Laporan Transaksi</h4>
        </Col>
        <Col>
          <Button className="float-end">Export</Button>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={4} className="mt-1">
          <Dropdown className="date-filter btn-group">
            <Button variant="secondary" onClick={() => decreaseDate()}>
              <ChevronLeft />
            </Button>

            <Dropdown.Toggle
              variant="default"
              className="border btn-date-filter bg-white"
              id="dropdown-basic"
            >
              {format(state[0].startDate, "dd/MM/yyyy") ===
              format(state[0].endDate, "dd/MM/yyyy")
                ? format(state[0].startDate, "dd/MM/yyyy")
                : format(state[0].startDate, "dd/MM/yyyy") +
                  " - " +
                  format(state[0].endDate, "dd/MM/yyyy")}
            </Dropdown.Toggle>
            <Button
              variant="secondary"
              onClick={() => increaseDate()}
              disabled={
                moment(new Date()).format("LL") ==
                moment(state[0].endDate).format("LL")
                  ? true
                  : false
              }
            >
              <ChevronRight />
            </Button>

            <Dropdown.Menu>
              <DateRangePicker
                onChange={(item) => setState([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={state}
                maxDate={new Date()}
                direction="horizontal"
              />
              <Row className="px-4">
                <Dropdown.Item
                  className="bg-primary w-100 text-light text-center"
                  onClick={() =>
                    getDataLaporan(state[0].startDate, state[0].endDate)
                  }
                >
                  Tampilkan
                </Dropdown.Item>
              </Row>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={3} className="mt-1 justify-content-center">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-button"
              variant="default"
              className="px-4 border w-100 btn-dropdown bg-white"
            >
              <Receipt />
              &nbsp; {jenisTransaksi}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item
                href="#/Umum"
                onClick={() => {
                  getDataLaporan(state[0].startDate, state[0].endDate, "umum");
                  setJenisTransaksi("Umum");
                }}
              >
                Umum
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                href="#/MA Grup"
                onClick={() => {
                  getDataLaporan(
                    state[0].startDate,
                    state[0].endDate,
                    "magrup"
                  );
                  setJenisTransaksi("MA Grup");
                }}
              >
                MA Grup
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={5} className="mt-1">
          {/* <InputGroup>
            <Form.Control type="text" id="search-data" placeholder="Cari..." />
            <InputGroup.Text id="basic-addon2">
              <Search />
            </InputGroup.Text>
          </InputGroup> */}
        </Col>
      </Row>
      <Row>
        <Col md={showDetail ? 8 : 12}>
          <Card>
            <Card.Body>
              <Row>
                <Col className="text-center">
                  <h5 className="fw-bold">{dataTotal.jumlah_transaksi}</h5>
                  <div className="text-secondary mt-2">TRANSAKSI</div>
                </Col>
                <Col className="text-center">
                  <h5 className="fw-bold">
                    <FormatRupiah value={dataTotal.total_transaksi} />
                  </h5>
                  <div className="text-secondary mt-2">TOTAL</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mt-1">
            <Card.Body>
              <Table responsive>
                {dataTransaksi.map((item, i) => (
                  <React.Fragment key={i}>
                    <thead>
                      <tr>
                        <th className="bg-lightgrey" colSpan={3}>
                          {moment
                            .tz(item.tanggal, "Asia/Jakarta")
                            .format("dddd, Do MMMM YYYY")}
                        </th>
                        <th className="text-end bg-lightgrey" colSpan={2}>
                          <FormatRupiah value={item.total} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.transaksi.map((detail, index) => (
                        <tr
                          key={index}
                          onClick={() => handleClickRow(detail.id)}
                        >
                          <td className="text-grey">#{detail.no_nota}</td>
                          <td className="text-grey">{detail.waktu}</td>
                          <td className="text-grey text-uppercase">
                            {detail.metode_pembayaran}
                          </td>
                          <td className="text-grey text-uppercase">
                            {detail.status == "lunas" ? (
                              <Badge bg="success">{detail.status}</Badge>
                            ) : (
                              <Badge bg="danger">{detail.status}</Badge>
                            )}
                          </td>
                          <td className="text-end text-grey">
                            <FormatRupiah value={detail.total} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </React.Fragment>
                ))}
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className={showDetail ? "d-block" : "d-none"}>
          <Card className="mt-1">
            <Card.Body>
              <div
                className="text-center overflow-y-scroll"
                style={{ height: "500px" }}
              >
                <img
                  src="../logo.png"
                  className="rounded-circle"
                  alt="..."
                  width="128px"
                />
                <br />
                <h5 className="fw-semibold mt-0">UD MURTI AJI</h5>
                <p>
                  Jl. Karang Kencana No.51, Panjunan, Kota Cirebon, Jawa Barat
                  45112 <br />
                  <i className="bi-telephone"></i> +62 85311579001
                </p>
                <hr style={{ margin: 0 }} />
                <table className="table table-sm table-borderless text-start">
                  <tbody>
                    <tr style={{ fontSize: "12px" }}>
                      <td className="text-secondary">
                        {moment(dataDetail.tanggal)
                          .tz("Asia/Jakarta")
                          .format("ll")}
                      </td>
                      <td className="text-end text-secondary">
                        {moment(dataDetail.tanggal)
                          .tz("Asia/Jakarta")
                          .format("LT")}
                      </td>
                    </tr>
                    <tr style={{ fontSize: "12px" }}>
                      <td className="text-secondary">No Nota</td>
                      <td className="text-end text-secondary">
                        {dataDetail.no_nota}
                      </td>
                    </tr>
                    <tr style={{ fontSize: "12px" }}>
                      <td className="text-secondary">Pelanggan</td>
                      <td className="text-end text-secondary">
                        {dataDetail.nama_pelanggan || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr style={{ margin: 0 }} />
                <table className="table table-sm table-borderless text-start">
                  <tbody>
                    {dataDetail.transaksi_detail.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.nama_produk} <br />
                          <i className="text-secondary">{item.nama_varian}</i>
                        </td>
                        <td>x{item.qty}</td>
                        <td className="text-end">
                          <FormatRupiah value={item.subtotal} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr style={{ margin: 0 }} />
                <div className="d-flex justify-content-between mb-2">
                  <b className="fs-5">Total</b>
                  <b className="fs-5">
                    <FormatRupiah value={dataDetail.total} />
                  </b>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    {dataDetail.metode_pembayaran.toString().toUpperCase()}
                  </span>
                  <span>
                    <FormatRupiah value={dataDetail.bayar} />
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Kembalian</span>
                  <span>{dataDetail.kembalian}</span>
                </div>
                <hr style={{ margin: 0 }} />
              </div>
              <Button
                variant="default"
                className="border mt-2"
                onClick={() => setShowDetail(false)}
              >
                Tutup
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LaporanTransaksi;
