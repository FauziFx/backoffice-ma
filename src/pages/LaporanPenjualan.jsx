import React, { useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Dropdown,
  Button,
  Table,
} from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { format, addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import LaporanRingkas from "../components/LaporanRingkas";
import LaporanJenisPenjualan from "../components/LaporanJenisPenjualan";
import LaporanKategoriPenjualan from "../components/LaporanKategoriPenjualan";
import LaporanPenjualanBarang from "../components/LaporanPenjualanBarang";
import LaporanMaGrup from "../components/LaporanMaGrup";

function LaporanPenjualan() {
  const [btnList, setButtonList] = useState([
    {
      id: 1,
      name: "Ringkasan",
    },
    {
      id: 2,
      name: "Jenis Penjualan",
    },
    {
      id: 3,
      name: "Kategori Penjualan",
    },
    {
      id: 4,
      name: "Penjualan Barang",
    },
    {
      id: 5,
      name: "MA Grup",
    },
  ]);

  const [active, setActive] = useState(1);

  const handleClick = (event) => {
    event.preventDefault();
    setActive(event.target.id);
  };

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

    setState([
      {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
      },
    ]);
  };

  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <h3>Laporan Penjualan</h3>
        </Col>
        <Col>
          {active == 5 && <Button className="float-end">Export</Button>}
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={6} className="mt-1">
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
            <Button variant="secondary" onClick={() => increaseDate()}>
              <ChevronRight />
            </Button>

            <Dropdown.Menu>
              <DateRangePicker
                onChange={(item) => {
                  setState([item.selection]);
                  console.log(item);
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={state}
                direction="horizontal"
              />
              <Row className="px-4">
                <Dropdown.Item className="bg-primary w-100 text-light text-center">
                  Tampilkan
                </Dropdown.Item>
              </Row>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          {btnList.map((item, index) => (
            <Button
              key={item.id}
              className={
                active == item.id
                  ? "w-100 text-start mb-2 rounded py-2"
                  : "w-100 text-start mb-2 text-secondary py-2"
              }
              variant={active == item.id ? "primary" : "default"}
              id={item.id}
              onClick={(e) => handleClick(e)}
            >
              {item.name}
            </Button>
          ))}
        </Col>
        <Col sm={12} md={9}>
          <Container className={active == 1 ? "d-block" : "d-none"}>
            <LaporanRingkas />
          </Container>
          <Container className={active == 2 ? "d-block" : "d-none"}>
            <LaporanJenisPenjualan />
          </Container>
          <Container className={active == 3 ? "d-block" : "d-none"}>
            <LaporanKategoriPenjualan />
          </Container>
          <Container className={active == 4 ? "d-block" : "d-none"}>
            <LaporanPenjualanBarang />
          </Container>
          <Container className={active == 5 ? "d-block" : "d-none"}>
            <LaporanMaGrup />
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default LaporanPenjualan;
