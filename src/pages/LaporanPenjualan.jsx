import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function LaporanPenjualan() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [laporanRingkas, setLaporanRingkas] = useState({});
  const [laporanMaGrup, setLaporanMaGrup] = useState([]);
  const [laporanMaGrupTotalItem, setLaporanMaGrupTotalItem] = useState(0);
  const [laporanMaGrupTotal, setLaporanMaGrupTotal] = useState(0);
  const [btnList, setButtonList] = useState([
    {
      id: 1,
      name: "Ringkasan",
    },
    {
      id: 2,
      name: "MA Grup",
    },
  ]);

  const [active, setActive] = useState(1);

  const handleClick = (event) => {
    event.preventDefault();
    const id = event.target.id;
    setActive(id);
    if (id == 1) {
      getLaporanRingkas(state[0].startDate, state[0].endDate);
    } else if (id == 2) {
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
    }
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

    if (active == 1) {
      getLaporanRingkas(state[0].startDate, state[0].endDate);
    } else if (active == 5) {
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
    }
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

    if (active == 1) {
      getLaporanRingkas(state[0].startDate, state[0].endDate);
    } else if (active == 5) {
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
    }
  };

  const getLaporanRingkas = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URL = API + "laporan/ringkasan";
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
        setLaporanRingkas(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterTanggal = () => {
    if (active == 1) {
      getLaporanRingkas(state[0].startDate, state[0].endDate);
    } else if (active == 5) {
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
    }
  };

  const getLaporanMaGrup = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URL = API + "laporan/magrup";
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
        let totalItem = response.data.data.reduce(function (prev, current) {
          return prev + +current.item_terjual;
        }, 0);
        let total = response.data.data.reduce(function (prev, current) {
          return prev + +current.total;
        }, 0);
        setLaporanMaGrup(response.data.data);
        setLaporanMaGrupTotalItem(totalItem);
        setLaporanMaGrupTotal(total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLaporanRingkas();
  }, []);

  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <h3>Laporan Penjualan</h3>
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
                }}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={state}
                direction="horizontal"
              />
              <Row className="px-4">
                <Dropdown.Item
                  className="bg-primary w-100 text-light text-center"
                  onClick={() => handleFilterTanggal()}
                >
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
            <LaporanRingkas data={laporanRingkas} />
          </Container>
          <Container className={active == 2 ? "d-block" : "d-none"}>
            <LaporanMaGrup
              data={laporanMaGrup}
              totalItem={laporanMaGrupTotalItem}
              total={laporanMaGrupTotal}
              date={state}
            />
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default LaporanPenjualan;
