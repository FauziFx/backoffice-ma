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
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
  const [labelLab, setLabelLab] = useState([]);
  const [dataLab, setDataLab] = useState([]);
  // Omzet
  const [omzetGrosir, setOmzetGrosir] = useState(0);
  const [omzetEceran, setOmzetEceran] = useState(0);
  const [omzetLainnya, setOmzetLainnya] = useState(0);
  const [omzetTotal, setOmzetTotal] = useState(0);
  const [omzetTarget, setOmzetTarget] = useState(0);
  const [pathColor, setPathColor] = useState("");

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

  const getDataBiayaLab = async (startDate, endDate) => {
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
        let data = response.data.data;
        data.sort((a, b) =>
          (a.nama_pelanggan || "").localeCompare(b.nama_pelanggan || "")
        );
        let labelArr = data.map((item) => item.nama_pelanggan || "-");
        let dataArr = data.map((item) => item.total);
        setLabelLab(labelArr);
        setDataLab(dataArr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataOmzet = async () => {
    moment.locale("id");
    const URLGrosir = API + "laporan/ringkasan";
    const URLEceran = API + "laporan/eceran";
    const URLLainnya = API + "laporan/magrup/";
    let start_date = moment().startOf("month").format("YYYY-MM-DD");
    let end_date = moment().endOf("month").format("YYYY-MM-DD");
    // let start_date = "2024-07-01";
    // let end_date = "2024-07-31";

    let totalGros, totalEce, totalLain;

    const grosir = await axios.get(URLGrosir, {
      params: {
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        Authorization: localStorage.getItem("user-token"),
      },
    });

    const MAkarangsembung = await axios.get(URLLainnya + 10, {
      params: {
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        Authorization: localStorage.getItem("user-token"),
      },
    });
    const MAsindang = await axios.get(URLLainnya + 14, {
      params: {
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        Authorization: localStorage.getItem("user-token"),
      },
    });
    const MAsandang = await axios.get(URLLainnya + 18, {
      params: {
        start_date: start_date,
        end_date: end_date,
      },
      headers: {
        Authorization: localStorage.getItem("user-token"),
      },
    });

    if (grosir.data.message == "invalid token") {
      localStorage.clear();
      return navigate("/login");
    } else {
      let data = grosir.data;
      totalGros = data.total;
      setOmzetGrosir(data.total);

      let totalKar =
        MAkarangsembung.data.data === undefined
          ? 0
          : MAkarangsembung.data.data.total;
      let totalSin =
        MAsindang.data.data === undefined ? 0 : MAsindang.data.data.total;
      let totalSan =
        MAsandang.data.data === undefined ? 0 : MAsandang.data.data.total;

      let totalLainnya =
        parseInt(totalKar) + parseInt(totalSin) + parseInt(totalSan);
      totalLain = totalLainnya;
      setOmzetLainnya(totalLainnya);
    }

    const eceran = await axios.get(URLEceran, {
      params: {
        start_date: start_date,
        end_date: end_date,
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
      totalEce = total;
      setOmzetEceran(total);
    }

    let totalOmzet =
      parseInt(totalGros) + parseInt(totalEce) + parseInt(totalLain);
    setOmzetTotal(totalOmzet);
    const percentageChange = (target, now) => (now / target) * 100 || 0;

    let target = percentageChange(120000000, totalOmzet).toFixed(0);
    setOmzetTarget(target);
    if (target < 50) {
      setPathColor("#dc3545");
    } else if (target < 80) {
      setPathColor("#fd7e14");
    } else {
      setPathColor("#198754");
    }
  };

  useEffect(() => {
    getDataGrosir(state[0].startDate, state[0].endDate);
    getDataMagrup(state[0].startDate, state[0].endDate);
    getData(state[0].startDate, state[0].endDate);
    getDataBiayaLab(state[0].startDate, state[0].endDate);
    getDataOmzet();
  }, []);

  const handleFilterTanggal = () => {
    getDataGrosir(state[0].startDate, state[0].endDate);
    getDataMagrup(state[0].startDate, state[0].endDate);
    getData(state[0].startDate, state[0].endDate);
    getDataBiayaLab(state[0].startDate, state[0].endDate);
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

  const dataChartBiayaLab = {
    labels: labelLab,
    datasets: [
      {
        label: "Biaya Lab",
        data: dataLab,
        fill: true,
        backgroundColor: [
          "#04004a",
          "#845ec2",
          "#d65db1",
          "#bd38b2",
          "#ff6f91",
          "#ff8066",
          "#ff9671",
          "#ffc75f",
          "#b39cd0",
          "#2c73d2",
          "#296073",
          "#0089ba",
          "#008f7a",
          "#005b44",
          "#00c9a7",
          "#c4fcef",
          "#4d8076",
          "#4b4453",
          "#b0a8b9",
          "#ac5e00",
          "#c34a36",
        ],
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
    <Container className="pt-4 title-page">
      <div className="d-flex align-items-center p-3 my-3 text-white bg-primary shadow-sm">
        <div className="lh-1">
          <h4 className="mb-0 text-white lh-1">Dashboard</h4>
        </div>
      </div>
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
                <Col xs={3} className="text-success text-end pt-3 ps-0 pe-2">
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
                <Col xs={3} className="text-danger text-end pt-3 ps-0 pe-2">
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
        {/* Chart Grosir */}
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
        {/* Chart MA Grup */}
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
        {/* Chart Bar Biaya Lab */}
        <Col md={8} className="my-2">
          <Card className="shadow">
            <Card.Header>
              <h6 className="mb-0">Biaya Lab MA Grup</h6>
            </Card.Header>
            <Card.Body>
              <Bar data={dataChartBiayaLab} />
            </Card.Body>
          </Card>
        </Col>
        {/* Omzet Bahagia */}
        <Col md={4} className="my-2">
          <Card className="shadow">
            <Card.Header>
              <h6 className="mb-0">Omzet Bahagia</h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-2">
                <h6>
                  Target Bulan
                  <strong> {moment().tz("Asia/Jakarta").format("MMMM")}</strong>
                </h6>
              </div>
              <div style={{ width: 150, height: 150, margin: "0 auto" }}>
                <CircularProgressbar
                  value={omzetTarget}
                  text={`${omzetTarget}%`}
                  styles={buildStyles({
                    pathColor: pathColor,
                    textColor: pathColor,
                  })}
                />
              </div>
              <ul className="list-group list-group-flush mt-2">
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className="text-primary"
                    />{" "}
                    Grosir
                  </div>
                  <span>
                    <FormatRupiah value={omzetGrosir} />
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <FontAwesomeIcon
                      icon={faGlasses}
                      className="text-success"
                    />{" "}
                    Eceran
                  </div>
                  <span>
                    <FormatRupiah value={omzetEceran} />
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <FontAwesomeIcon icon={faStore} className="text-danger" />{" "}
                    Lainnya
                  </div>
                  <span>
                    <FormatRupiah value={omzetLainnya} />
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start mt-2">
                  <div className="fw-bold">TOTAL</div>
                  <strong>
                    <FormatRupiah value={omzetTotal} />
                  </strong>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
