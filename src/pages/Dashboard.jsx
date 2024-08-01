import React, { useState } from "react";
import { Container, Card, Row, Col, Dropdown, Button } from "react-bootstrap";
import { format, addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { Calendar, Clock } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faArrowTrendUp,
  faArrowTrendDown,
  faStore,
  faReceipt,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import CountUp from "react-countup";

function Dashboard() {
  let tgl = moment().tz("Asia/Jakarta").format("dddd, MMMM Do YYYY");
  let jam = moment().tz("Asia/Jakarta").format("H:mm:ss");
  const [tanggal, setTanggal] = useState(tgl);
  const [waktu, setWaktu] = useState(jam);
  const UpdateTime = () => {
    tgl = moment().tz("Asia/Jakarta").format("dddd, MMMM Do YYYY");
    jam = moment().tz("Asia/Jakarta").format("H:mm:ss");
    setTanggal(tgl);
    setWaktu(jam);
  };
  setInterval(UpdateTime);

  const dataChartGrosir = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Grosir",
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "#0d6efda3",
        borderColor: "#0d6efd",
      },
    ],
  };

  const dataChartMaGrup = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Grosir",
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "#6610f2a3",
        borderColor: "#6610f2",
      },
    ],
  };

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <Container className="pt-4">
      <h3>Dashboard</h3>
      <Row>
        <Col md={8}>
          <Calendar /> {tanggal}
          <Clock className="ms-2" /> {waktu} WIB
        </Col>
        {/* Date Range */}
        <Col md={4} className="d-flex justify-content-center mt-1">
          <Dropdown className="date-filter btn-group">
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

            <Dropdown.Menu>
              <DateRangePicker
                onChange={(item) => {
                  setState([item.selection]);
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={state}
                direction="horizontal"
              />
              <Row className="px-4">
                <Dropdown.Item
                  className="bg-primary w-100 text-light text-center"
                  // onClick={() => handleFilterTanggal()}
                >
                  Tampilkan
                </Dropdown.Item>
              </Row>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Panel */}
      <Row className="pt-1">
        <Col xl={3} md={6} className="my-1">
          <Card className="shadow border-left-primary">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <div className="text-lighter text-dark mb-1">
                    Rata-Rata <strong>Grosir</strong>
                  </div>
                  <h4 className="text-gray-800 mt-2">
                    Rp <CountUp end={3500000} />
                  </h4>
                </Col>
                <Col xs={3} className="text-success text-end pt-3 ">
                  <FontAwesomeIcon icon={faArrowTrendUp} size="2x" />
                  {/* <FontAwesomeIcon icon={faArrowTrendDown} size="2x" /> */}
                  <span className="text-success">+5%</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <small>* Dibandingkan dengan bulan kemarin</small>
        </Col>
        <Col xl={3} md={6} className="my-1">
          <Card className="shadow border-left-indigo">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <div className="text-lighter text-dark mb-1">
                    Rata-Rata <strong>MA Grup</strong>
                  </div>
                  <h4 className="text-gray-800 mt-2">
                    Rp <CountUp end={3500000} />
                  </h4>
                </Col>
                <Col xs={3} className="text-danger text-end pt-3 ">
                  {/* <FontAwesomeIcon icon={faArrowTrendUp} size="2x" /> */}
                  <FontAwesomeIcon icon={faArrowTrendDown} size="2x" />
                  <span className="text-danger">-5%</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <small>* Dibandingkan dengan bulan kemarin</small>
        </Col>
        <Col xl={3} md={6} className="my-1">
          <Card className="shadow border-left-dark mb-1">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <div className="text-lighter text-dark mb-1">
                    Total Transaksi
                  </div>
                  <h4 className="text-gray-800 mt-2">
                    <CountUp end={350} />
                  </h4>
                </Col>
                <Col
                  xs={3}
                  className="text-dark text-end pt-3"
                  style={{ marginBottom: "20px" }}
                >
                  <FontAwesomeIcon icon={faReceipt} size="2x" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="my-1">
          <Card className="shadow border-left-success mb-1">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <div className="text-lighter text-dark mb-1">
                    Total Produk
                  </div>
                  <h4 className="text-gray-800 mt-2">
                    <CountUp end={304} />
                  </h4>
                </Col>
                <Col
                  xs={3}
                  className="text-success text-end pt-3"
                  style={{ marginBottom: "20px" }}
                >
                  <FontAwesomeIcon icon={faTable} size="2x" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Row>
        <Col md={6} className="my-2">
          <Card className="shadow">
            <Card.Header>
              <h6 className="mb-0">Grafik Penjualan Grosir</h6>
            </Card.Header>
            <Card.Body>
              <Line data={dataChartGrosir} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="my-2">
          <Card className="shadow">
            <Card.Header>
              <h6 className="mb-0">Grafik Penjualan MA Grup</h6>
            </Card.Header>
            <Card.Body>
              <Line data={dataChartMaGrup} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
