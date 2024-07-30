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
import LaporanMaGrup from "../components/LaporanMaGrup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function LaporanPenjualan() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataExportGrosir, setDataExportGrosir] = useState([]);
  const [dataExportEceran, setDataExportEceran] = useState([]);
  const [dataExportTotal, setDataExportTotal] = useState([]);
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
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
      getLaporan(state[0].startDate, state[0].endDate);
      getLaporanEceran(state[0].startDate, state[0].endDate);
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
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
      getLaporan(state[0].startDate, state[0].endDate);
      getLaporanEceran(state[0].startDate, state[0].endDate);
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
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
      getLaporan(state[0].startDate, state[0].endDate);
      getLaporanEceran(state[0].startDate, state[0].endDate);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterTanggal = () => {
    if (active == 1) {
      getLaporanRingkas(state[0].startDate, state[0].endDate);
      getLaporanMaGrup(state[0].startDate, state[0].endDate);
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
        setDataExportTotal((prev) => ({
          ...prev,
          magrup: total,
        }));
        setLaporanMaGrup(response.data.data);
        setLaporanMaGrupTotalItem(totalItem);
        setLaporanMaGrupTotal(total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLaporanEceran = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URL = API + "laporan/eceran";
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
        let data = response.data.data;
        let total = data.reduce(function (prev, current) {
          return prev + +current.Total;
        }, 0);
        const customHeadings = data.map((item, i) => ({
          No: i + 1,
          Tanggal: moment(item.Tanggal)
            .tz("Asia/Jakarta")
            .format("DD MMMM YYYY"),
          Total: parseInt(item.Total),
        }));
        setDataExportTotal((prev) => ({
          ...prev,
          eceran: total,
        }));
        customHeadings.push(
          { Tanggal: "", Total: "" },
          { Tanggal: "TOTAL", Total: total }
        );
        setDataExportEceran(customHeadings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLaporan = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URL = API + "laporan";
      const response = await axios.get(URL, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      const MAkarangsembung = await axios.get(URL + "/magrup/" + 10, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      const MAsindang = await axios.get(URL + "/magrup/" + 14, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      const MAsandang = await axios.get(URL + "/magrup/" + 18, {
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
        const data = response.data.data.map((item, i) => ({
          Tanggal: moment(item.tanggal)
            .tz("Asia/Jakarta")
            .format("DD MMMM YYYY"),
          Total: item.total,
        }));
        data.push(
          {
            Tanggal:
              MAkarangsembung.data.data === undefined
                ? "MA KARANGSEMBUNG"
                : MAkarangsembung.data.data.nama_pelanggan,
            Total:
              MAkarangsembung.data.data === undefined
                ? 0
                : MAkarangsembung.data.data.total,
          },
          {
            Tanggal:
              MAsindang.data.data === undefined
                ? "MA SINDANG"
                : MAsindang.data.data.nama_pelanggan,
            Total:
              MAsindang.data.data === undefined ? 0 : MAsindang.data.data.total,
          },
          {
            Tanggal:
              MAsandang.data.data === undefined
                ? "SANDANG MATA"
                : MAsandang.data.data.nama_pelanggan,
            Total:
              MAsandang.data.data === undefined ? 0 : MAsandang.data.data.total,
          }
        );
        let totalLaporan = data.reduce(function (prev, current) {
          return prev + +current.Total;
        }, 0);
        setDataExportTotal((prev) => ({
          ...prev,
          grosir: totalLaporan,
        }));
        data.push(
          {
            Tanggal: "",
            Total: "",
          },
          {
            Tanggal: "TOTAL",
            Total: totalLaporan,
          }
        );
        setDataExportGrosir(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLaporanRingkas();
    getLaporan(state[0].startDate, state[0].endDate);
    getLaporanEceran(state[0].startDate, state[0].endDate);
    getLaporanMaGrup(state[0].startDate, state[0].endDate);
  }, [state]);

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
            <LaporanRingkas
              data={laporanRingkas}
              dataGrosir={dataExportGrosir}
              dataEceran={dataExportEceran}
              dataMagrup={laporanMaGrup}
              dataMagrupTotal={laporanMaGrupTotal}
              dataTotal={dataExportTotal}
              startDate={state[0].startDate}
              endDate={state[0].endDate}
            />
          </Container>
          <Container className={active == 2 ? "d-block" : "d-none"}>
            <LaporanMaGrup
              data={laporanMaGrup}
              totalItem={laporanMaGrupTotalItem}
              total={laporanMaGrupTotal}
              startDate={state[0].startDate}
              endDate={state[0].endDate}
            />
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default LaporanPenjualan;
