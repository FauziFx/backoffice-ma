import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { addDays, format } from "date-fns";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Table,
  Card,
} from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import TambahPenyesuaian from "../components/TambahPenyesuaian";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function PenyesuaianStok() {
  const [dataPenyesuaian, setDataPenyesuaian] = useState([]);
  const [dataDetail, setDataDetail] = useState({
    id: "",
    tanggal: "",
    id_produk: "",
    id_varian: "",
    nama_produk: "",
    stok_tersedia: "",
    stok_aktual: "",
    penyesuaian: "",
    catatan: "",
  });
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const handleShowTambah = () => {
    setShowTambah(!showTambah);
  };

  const increaseDate = () => {
    const startDate = addDays(state[0].startDate, 1);
    const endDate = addDays(state[0].endDate, 1);
    getDataPenyesuaian(startDate, endDate);
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
    getDataPenyesuaian(startDate, endDate);
    setState([
      {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
      },
    ]);
  };

  const getDataPenyesuaian = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URL = API + "penyesuaian";
      const response = await axios.get(URL, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setDataPenyesuaian(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickRow = async (id) => {
    setShowDetail(true);
    setShowTambah(false);
    const data = dataPenyesuaian.filter((item) => item.id == id)[0];
    setDataDetail(data);
  };

  useEffect(() => {
    getDataPenyesuaian(state.startDate, state.endDate);
  }, []);

  return (
    <Container className="pt-4 title-page">
      <Row className="p-2 text-white bg-primary shadow-sm mx-1">
        <Col className="pt-1">
          <h4 className="mb-0">Penyesuaian Stok</h4>
        </Col>
        <Col className=" d-none d-sm-none d-md-block">
          <span className="float-end">
            {/* <Dropdown className="btn-group me-1" role="group">
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Import / Export
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Import Data</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Export Data</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            <Button onClick={() => handleShowTambah()}>Tambah</Button>
          </span>
        </Col>
      </Row>
      <Row>
        <Col md={showTambah || showDetail ? 6 : 12}>
          <Row>
            <Col md={6} className="mt-1">
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
                    onChange={(item) => {
                      setState([item.selection]);
                    }}
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
                        getDataPenyesuaian(state[0].startDate, state[0].endDate)
                      }
                    >
                      Tampilkan
                    </Dropdown.Item>
                  </Row>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <Card className="mt-1">
            <Card.Body>
              <Table hover size="md" responsive className="mt-2">
                <thead>
                  <tr>
                    <th className="p-2 bg-light">Tanggal</th>
                    <th className="p-2 bg-light">Catatan</th>
                    <th className="p-2 bg-light">Produk</th>
                    <th className="p-2 bg-light">Penyesuaian</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPenyesuaian.map((item, index) => (
                    <tr key={index} onClick={() => handleClickRow(item.id)}>
                      <td>
                        {moment
                          .tz(item.tanggal, "Asia/Jakarta")
                          .format("DD MMM YYYY, LT")}
                      </td>
                      <td>{item.catatan || "-"}</td>
                      <td>{item.nama_produk}</td>
                      <td>
                        {item.penyesuaian > 0
                          ? "+" + item.penyesuaian
                          : item.penyesuaian}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className={showTambah ? "d-block" : "d-none"}>
          <TambahPenyesuaian
            closeButton={handleShowTambah}
            getDataPenyesuaian={getDataPenyesuaian}
          />
        </Col>
        <Col md={6} className={showDetail ? "d-block" : "d-none"}>
          <Container>
            <Card className="mt-1">
              <Card.Body>
                <Row>
                  <Col
                    md={12}
                    sm={12}
                    className="overflow-y-scroll"
                    style={{ height: "550px" }}
                  >
                    <small className="mb-0">Informasi</small>
                    <hr style={{ margin: 0 }} />
                    <br />
                    <Row className="mb-2">
                      <Col sm={2}>Tanggal</Col>
                      <Col sm={10} className="text-end">
                        {moment
                          .tz(dataDetail.tanggal, "Asia/Jakarta")
                          .format("DD MMM YYYY, LT")}
                      </Col>
                    </Row>
                    <hr style={{ margin: 0 }} />
                    <Row className="my-2">
                      <Col sm={2}>Catatan</Col>
                      <Col sm={10} className="text-end">
                        {dataDetail.catatan || "-"}
                      </Col>
                    </Row>
                    <hr style={{ margin: 0 }} />
                    <br />
                    <br />
                    <small className="mb-0 mt-4">Penyesuaian Stok</small>
                    <hr style={{ margin: 0 }} />
                    <br />
                    <h6>{dataDetail.nama_produk}</h6>
                    <Row className="mt-2">
                      <Col sm={4} className="text-center">
                        Stok Tersedia
                      </Col>
                      <Col sm={4} className="text-center">
                        Stok Aktual
                      </Col>
                      <Col sm={4} className="text-center">
                        Penyesuaian
                      </Col>
                    </Row>
                    <hr style={{ margin: 0 }} />
                    <Row className="mt-2 fw-light">
                      <Col sm={4} className="text-center">
                        {dataDetail.stok_tersedia}
                      </Col>
                      <Col sm={4} className="text-center">
                        {dataDetail.stok_aktual}
                      </Col>
                      <Col sm={4} className="text-center">
                        {dataDetail.penyesuaian}
                      </Col>
                    </Row>
                    <hr style={{ margin: 0 }} />
                  </Col>
                </Row>
                <Button
                  variant="default"
                  className="border"
                  onClick={() => setShowDetail(false)}
                >
                  Tutup
                </Button>
              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default PenyesuaianStok;
