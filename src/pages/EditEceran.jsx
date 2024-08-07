import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Card,
  FormControl,
} from "react-bootstrap";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link, useLocation } from "react-router-dom";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function EditEceran() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { state } = useLocation();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const [data, setData] = useState({
    id: "",
    no_nota: "",
    nama: "",
    alamat: "",
    nohp: "",
    frame: "",
    lensa: "",
    harga: "",
    rsph: "",
    rcyl: "",
    raxis: "",
    radd: "",
    lsph: "",
    lcyl: "",
    laxis: "",
    ladd: "",
    tanggal: "",
  });

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangePower = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setData((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    } else if (value == "-" || value == "+") {
      setData((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const od = [data.rsph, data.rcyl, data.raxis, data.radd].join("/");
      const os = [data.lsph, data.lcyl, data.laxis, data.ladd].join("/");

      const URL = API + "eceran/" + data.id;
      const response = await axios.put(
        URL,
        {
          no_nota: data.no_nota,
          nama: data.nama,
          alamat: data.alamat,
          nohp: data.nohp,
          frame: data.frame,
          lensa: data.lensa,
          harga: parseInt(data.harga.split(",").join("")),
          tanggal: data.tanggal,
          r: od,
          l: os,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        if (response.data.success) {
          Toast.fire({
            icon: "success",
            title: response.data.message,
          });
        } else {
          Toast.fire({
            icon: "success",
            title: "Something Error!!!",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  useEffect(() => {
    const row = state.row;
    const od = row.r.split("/");
    const os = row.l.split("/");
    setData({
      id: row.id,
      no_nota: row.no_nota,
      nama: row.nama,
      alamat: row.alamat,
      nohp: row.nohp,
      frame: row.frame,
      lensa: row.lensa,
      harga: addCommas(row.harga),
      rsph: od[0],
      rcyl: od[1],
      raxis: od[2],
      radd: od[3],
      lsph: os[0],
      lcyl: os[1],
      laxis: os[2],
      ladd: os[3],
      tanggal: moment(row.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD"),
    });
  }, [state]);

  return (
    <Container className="pt-4 pb-4 title-page">
      <Row className="p-2 text-white bg-primary shadow-sm mx-1">
        <Col className="pt-1">
          <h4 className="mb-0">Edit Eceran</h4>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <div>
            <Button variant="default" onClick={() => navigate("/eceran")}>
              <ArrowLeftCircleFill /> Kembali
            </Button>
          </div>
        </Col>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="pb-4">
            <Card.Body>
              <i className="text-danger" style={{ fontSize: "12px" }}>
                * Wajib Diisi
              </i>
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <Form.Group className="mb-1">
                  <Form.Label column>
                    Tanggal <i className="text-danger">*</i>
                  </Form.Label>
                  <FormControl
                    type="date"
                    required
                    name="tanggal"
                    value={data.tanggal}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>
                    No Nota <i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    name="no_nota"
                    placeholder="No Nota"
                    value={data.no_nota}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>
                    Nama <i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    name="nama"
                    placeholder="Nama"
                    value={data.nama}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>Alamat</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="alamat"
                    placeholder="Alamat"
                    value={data.alamat}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>No Hp</Form.Label>
                  <Form.Control
                    type="text"
                    name="nohp"
                    placeholder="No Hp"
                    value={data.nohp}
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        nohp: removeNonNumeric(e.target.value),
                      }));
                    }}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>Frame</Form.Label>
                  <Form.Control
                    type="text"
                    name="frame"
                    placeholder="Frame"
                    value={data.frame}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>Lensa</Form.Label>
                  <Form.Control
                    type="text"
                    name="lensa"
                    placeholder="Lensa"
                    value={data.lensa}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>
                    Harga <i className="text-danger">*</i>
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3">Rp</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="harga"
                      placeholder="0"
                      value={data.harga}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          harga: addCommas(removeNonNumeric(e.target.value)),
                        }));
                      }}
                      autoComplete="off"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Row className="px-2">
                    <Col
                      xs={1}
                      className="fw-bold p-0 pt-1"
                      style={{ fontSize: "12px" }}
                    >
                      OD
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="rsph"
                        size="sm"
                        type="text"
                        placeholder="SPH"
                        value={data.rsph}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="rcyl"
                        size="sm"
                        type="text"
                        placeholder="CYL"
                        value={data.rcyl}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="raxis"
                        size="sm"
                        type="text"
                        placeholder="AXIS"
                        value={data.raxis}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="radd"
                        size="sm"
                        type="text"
                        placeholder="ADD"
                        value={data.radd}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                  </Row>
                  <Row className="px-2">
                    <Col
                      xs={1}
                      className="fw-bold p-0 pt-1"
                      style={{ fontSize: "12px" }}
                    >
                      OS
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="lsph"
                        size="sm"
                        type="text"
                        placeholder="SPH"
                        value={data.lsph}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="lcyl"
                        size="sm"
                        type="text"
                        placeholder="CYL"
                        value={data.lcyl}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="laxis"
                        size="sm"
                        type="text"
                        placeholder="AXIS"
                        value={data.laxis}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="ladd"
                        size="sm"
                        type="text"
                        placeholder="ADD"
                        value={data.ladd}
                        onChange={(e) => handleChangePower(e)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="default" onClick={() => navigate("/eceran")}>
                    Batal
                  </Button>
                  <Button variant="primary" type="submit">
                    Simpan
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditEceran;
