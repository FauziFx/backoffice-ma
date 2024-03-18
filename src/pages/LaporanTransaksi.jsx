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
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [dataTotal, setDataTotal] = useState({});

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
        console.log(response.data.data);
        console.log(response.data.data_total);
        setDataTransaksi(response.data.data);
        setDataTotal(response.data.data_total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataLaporan(state.startDate, state.endDate);
  }, []);

  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <h3>Laporan Transaksi</h3>
        </Col>
        <Col>
          <Button className="float-end">Export</Button>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={3} className="mt-1">
          <Dropdown className="date-filter btn-group">
            <Button variant="secondary" onClick={() => decreaseDate()}>
              <ChevronLeft />
            </Button>

            <Dropdown.Toggle
              variant="default"
              className="border btn-date-filter"
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
              className="px-4 border w-100 btn-dropdown"
            >
              <Receipt />
              &nbsp; Jenis Transaksi
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item
                href="#/Umum"
                onClick={() =>
                  getDataLaporan(state[0].startDate, state[0].endDate, "umum")
                }
              >
                Umum
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                href="#/MA Grup"
                onClick={() =>
                  getDataLaporan(state[0].startDate, state[0].endDate, "magrup")
                }
              >
                MA Grup
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={6} className="mt-1">
          <InputGroup>
            <Form.Control type="text" id="search-data" placeholder="Cari..." />
            <InputGroup.Text id="basic-addon2">
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
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
            {item.transaksi.map((detail, index) => (
              <tbody key={index}>
                <tr>
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
              </tbody>
            ))}
          </React.Fragment>
        ))}
      </Table>
    </Container>
  );
}

export default LaporanTransaksi;
