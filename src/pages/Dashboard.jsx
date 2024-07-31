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

      <Row className="mt-2">
        <Col xl={3} md={6}>
          <Card className="shadow border-left-dark mb-3">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <h6 className="text-lighter text-dark mb-0">
                    Rata-Rata Grosir
                  </h6>
                  <h3 className="text-gray-800">
                    {/* <CountUp end={total.totalPasien} /> */}
                    100.000
                  </h3>
                  {/* <span className="text-success">
                    5%
                    <FontAwesomeIcon icon={faArrowTrendUp} className="ms-1" />
                  </span> */}
                  <span className="text-danger">
                    -5%
                    <FontAwesomeIcon icon={faArrowTrendDown} className="ms-1" />
                  </span>
                </Col>
                <Col xs={3} className="text-gray-800 text-end pt-3">
                  <FontAwesomeIcon icon={faChartLine} size="2x" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
