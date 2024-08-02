import React, { useEffect, useState } from "react";
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
  faGlasses,
} from "@fortawesome/free-solid-svg-icons";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  let tgl = moment().tz("Asia/Jakarta").format("dddd, MMMM Do YYYY");
  let jam = moment().tz("Asia/Jakarta").format("H:mm:ss");
  const [tanggal, setTanggal] = useState(tgl);
  const [waktu, setWaktu] = useState(jam);
  const UpdateTime = () => {
    tgl = moment().tz("Asia/Jakarta").format("dddd, Do MMMM YYYY");
    jam = moment().tz("Asia/Jakarta").format("H:mm:ss");
    setTanggal(tgl);
    setWaktu(jam);
  };
  setInterval(UpdateTime);

  const [labelGrosir, setLabelGrosir] = useState([]);
  const [dataGrosir, setDataGrosir] = useState([]);
  const [labelMagrup, setLabelMagrup] = useState([]);
  const [dataMagrup, setDataMagrup] = useState([]);
  const [avgGrosir, setAvgGrosir] = useState("");
  const [avgMagrup, setAvgMagrup] = useState("");
  const [totalGrosir, setTotalGrosir] = useState("");
  const [totalMagrup, setTotalMagrup] = useState("");
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [totalEceran, setTotalEceran] = useState(0);
  const [diffGrosir, setDiffGrosir] = useState(0);
  const [diffMagrup, setDiffMagrup] = useState(0);

  const getData = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URLEceran = API + "laporan/eceran";
      const URLTransaksi = API + "transaksi/count";

      const eceran = await axios.get(URLEceran, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });

      if (eceran.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        let data = eceran.data.data;
        let total = data.reduce(function (prev, current) {
          return prev + +parseInt(current.Total);
        }, 0);
        setTotalEceran(total);
      }

      const transaksi = await axios.get(URLTransaksi, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });

      if (transaksi.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        let jmlTrx = transaksi.data.data.jumlah_transaksi;
        setJumlahTransaksi(jmlTrx);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataGrosir = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URL = API + "laporan/transaksi";
      let netLast, netNow;

      const firstDateInMs = startDate.getTime();
      const secondDateInMs = endDate.getTime();

      const differenceBtwDates = secondDateInMs - firstDateInMs;

      const aDayInMs = 24 * 60 * 60 * 1000;

      const daysDiff = Math.round(differenceBtwDates / aDayInMs);

      const end_dateLM = moment(startDate)
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      const start_dateLM = moment(end_dateLM)
        .subtract(daysDiff, "days")
        .format("YYYY-MM-DD");

      const response = await axios.get(URL, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
          jenis_transaksi: "umum",
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });

      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        let data = response.data.data.reverse();
        let total = data.reduce(function (prev, current) {
          return prev + +parseInt(current.total);
        }, 0);

        setTotalGrosir(total);
        netNow = total;
        let avg = total / data.length;
        setAvgGrosir(avg);

        let labelArr = data.map((item) =>
          moment(item.tanggal).tz("Asia/Jakarta").format("Do-MMM-YY")
        );
        let dataArr = data.map((item) => item.total);
        setLabelGrosir(labelArr);
        setDataGrosir(dataArr);
      }

      const lastMonth = await axios.get(URL, {
        params: {
          start_date: start_dateLM,
          end_date: end_dateLM,
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });

      if (lastMonth.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        let data = lastMonth.data.data;
        let total = data.reduce(function (prev, current) {
          return prev + +parseInt(current.total);
        }, 0);
        netLast = total;
      }

      const percentageChange = (last, now) => (now / last) * 100 - 100 || 0;

      let diff = percentageChange(netLast, netNow).toFixed(1) + "%";
      setDiffGrosir(diff);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataMagrup = async (startDate, endDate) => {
    try {
      moment.locale("id");
      const URL = API + "laporan/transaksi";
      let netLast, netNow;

      const firstDateInMs = startDate.getTime();
      const secondDateInMs = endDate.getTime();

      const differenceBtwDates = secondDateInMs - firstDateInMs;

      const aDayInMs = 24 * 60 * 60 * 1000;

      const daysDiff = Math.round(differenceBtwDates / aDayInMs);

      const end_dateLM = moment(startDate)
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      const start_dateLM = moment(end_dateLM)
        .subtract(daysDiff, "days")
        .format("YYYY-MM-DD");

      const response = await axios.get(URL, {
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
          jenis_transaksi: "magrup",
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });

      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        let data = response.data.data.reverse();

        let total = data.reduce(function (prev, current) {
          return prev + +parseInt(current.total);
        }, 0);
        setTotalMagrup(total);
        netNow = total;
        let avg = total / data.length;
        setAvgMagrup(avg);

        let labelArr = data.map((item) =>
          moment(item.tanggal).tz("Asia/Jakarta").format("Do-MMM-YY")
        );
        let dataArr = data.map((item) => item.total);
        setLabelMagrup(labelArr);
        setDataMagrup(dataArr);
      }

      const lastMonth = await axios.get(URL, {
        params: {
          start_date: start_dateLM,
          end_date: end_dateLM,
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });

      if (lastMonth.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        let data = lastMonth.data.data;
        let total = data.reduce(function (prev, current) {
          return prev + +parseInt(current.total);
        }, 0);
        netLast = total;
      }

      const percentageChange = (last, now) => (now / last) * 100 - 100 || 0;

      let diff = percentageChange(netLast, netNow).toFixed(1) + "%";
      setDiffMagrup(diff);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataGrosir(state[0].startDate, state[0].endDate);
    getDataMagrup(state[0].startDate, state[0].endDate);
    getData(state[0].startDate, state[0].endDate);
  }, []);

  const handleFilterTanggal = () => {
    getDataGrosir(state[0].startDate, state[0].endDate);
    getDataMagrup(state[0].startDate, state[0].endDate);
    getData(state[0].startDate, state[0].endDate);
  };

  const dataChartGrosir = {
    labels: labelGrosir,
    datasets: [
      {
        label: "Grosir",
        data: dataGrosir,
        fill: true,
        backgroundColor: "#0d6efda3",
        borderColor: "#0d6efd",
        lineTension: 0.3,
      },
    ],
  };

  const dataChartMaGrup = {
    labels: labelMagrup,
    datasets: [
      {
        label: "MA Grup",
        data: dataMagrup,
        fill: true,
        backgroundColor: "#6610f2a3",
        borderColor: "#6610f2",
        lineTension: 0.3,
      },
    ],
  };

  Date.prototype.subtractDays = function (d) {
    this.setDate(this.getDate() - d);
    return this;
  };

  const [state, setState] = useState([
    {
      startDate: new Date().subtractDays(29),
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
              <Row className="px-4 mb-2">
                <Dropdown.Item
                  className="bg-primary w-100 text-light text-center py-2"
                  onClick={() => handleFilterTanggal()}
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
        <small style={{ fontSize: "11px" }}>
          * Dibandingkan dengan bulan sebelumnya
        </small>
        <Col xl={3} md={6} className="my-1">
          <Card className="shadow border-left-primary">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <div className="text-lighter text-dark mb-1">
                    Total <strong>Grosir</strong>
                  </div>
                  <h5 className="text-gray-800 mt-2">
                    Rp <CountUp end={totalGrosir} />
                  </h5>
                </Col>
                <Col xs={3} className="text-success text-end pt-3 px-1">
                  {diffGrosir.toString().includes("-") ? (
                    <>
                      <FontAwesomeIcon
                        className="text-danger"
                        icon={faArrowTrendDown}
                        size="2x"
                      />
                      <span
                        style={{ fontSize: "11px" }}
                        className="text-danger"
                      >
                        {diffGrosir}
                      </span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        className="text-success"
                        icon={faArrowTrendUp}
                        size="2x"
                      />
                      <span
                        style={{ fontSize: "12px" }}
                        className="text-success"
                      >
                        +{diffGrosir}
                      </span>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="my-1">
          <Card className="shadow border-left-indigo">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <div className="text-lighter text-dark mb-1">
                    Total <strong>MA Grup</strong>
                  </div>
                  <h5 className="text-gray-800 mt-2">
                    Rp <CountUp end={totalMagrup} />
                  </h5>
                </Col>
                <Col xs={3} className="text-danger text-end pt-3 px-1">
                  {diffMagrup.toString().includes("-") ? (
                    <>
                      <FontAwesomeIcon
                        className="text-danger"
                        icon={faArrowTrendDown}
                        size="2x"
                      />
                      <span
                        style={{ fontSize: "11px" }}
                        className="text-danger"
                      >
                        {diffMagrup}
                      </span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        className="text-success"
                        icon={faArrowTrendUp}
                        size="2x"
                      />
                      <span
                        style={{ fontSize: "12px" }}
                        className="text-success"
                      >
                        +{diffMagrup}
                      </span>
                    </>
                  )}
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
                    Total <strong>Eceran</strong>
                  </div>
                  <h5 className="text-gray-800 mt-2">
                    Rp <CountUp end={totalEceran} />
                  </h5>
                </Col>
                <Col
                  xs={3}
                  className="text-success text-end pt-3"
                  style={{ marginBottom: "20px" }}
                >
                  <FontAwesomeIcon icon={faGlasses} size="2x" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6} className="my-1">
          <Card className="shadow border-left-dark mb-1">
            <Card.Body>
              <Row>
                <Col xs={9}>
                  <div className="text-lighter text-dark mb-1">
                    Jumlah <strong>Transaksi</strong>
                  </div>
                  <h5 className="text-gray-800 mt-2">
                    <CountUp end={jumlahTransaksi} />
                  </h5>
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
      </Row>

      {/* Chart */}
      <Row>
        <Col md={6} className="my-2">
          <Card className="shadow">
            <Card.Header>
              <h6 className="mb-0">Grafik Grosir</h6>
            </Card.Header>
            <Card.Body>
              <small>
                Rata-rata: <FormatRupiah value={avgGrosir} />
              </small>
              <Line data={dataChartGrosir} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="my-2">
          <Card className="shadow">
            <Card.Header>
              <h6 className="mb-0">Grafik MA Grup</h6>
            </Card.Header>
            <Card.Body>
              <small>
                Rata-rata: <FormatRupiah value={avgMagrup} />
              </small>
              <Line data={dataChartMaGrup} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
