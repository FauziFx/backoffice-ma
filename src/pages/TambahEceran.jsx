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
import { useNavigate, Link } from "react-router-dom";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function TambahEceran() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  return (
    <Container className="pt-4 pb-4">
      <Row>
        <Col>
          <h3>Tambah Eceran</h3>
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
              <Form autoComplete="off">
                <Form.Group className="mb-1">
                  <Form.Label column>
                    Tanggal <i className="text-danger">*</i>
                  </Form.Label>
                  <FormControl
                    type="date"
                    required
                    name="tanggal"
                    // value={dataUser.nama}
                    // onChange={(e) => handleChange(e)}
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
                    // value={dataUser.nama}
                    // onChange={(e) => handleChange(e)}
                    autoComplete="off"
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
                    // value={dataUser.nama}
                    // onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>Frame</Form.Label>
                  <Form.Control
                    type="text"
                    name="frame"
                    placeholder="Frame"
                    // value={dataUser.nama}
                    // onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label column>Lensa</Form.Label>
                  <Form.Control
                    type="text"
                    name="lensa"
                    placeholder="Lensa"
                    // value={dataUser.nama}
                    // onChange={(e) => handleChange(e)}
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
                      // value={dataUser.nama}
                      // onChange={(e) => handleChange(e)}
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
                        // value={ukuranBaru.rsph}
                        // onChange={(e) => handleChangeUbPower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="rcyl"
                        size="sm"
                        type="text"
                        placeholder="CYL"
                        // value={ukuranBaru.rcyl}
                        // onChange={(e) => handleChangeUbPower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="raxis"
                        size="sm"
                        type="text"
                        placeholder="AXIS"
                        // value={ukuranBaru.raxis}
                        // onChange={(e) => handleChangeUbPower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="radd"
                        size="sm"
                        type="text"
                        placeholder="ADD"
                        // value={ukuranBaru.radd}
                        // onChange={(e) => handleChangeUbPower(e)}
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
                        // value={ukuranBaru.lsph}
                        // onChange={(e) => handleChangeUbPower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="lcyl"
                        size="sm"
                        type="text"
                        placeholder="CYL"
                        // value={ukuranBaru.lcyl}
                        // onChange={(e) => handleChangeUbPower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="laxis"
                        size="sm"
                        type="text"
                        placeholder="AXIS"
                        // value={ukuranBaru.laxis}
                        // onChange={(e) => handleChangeUbPower(e)}
                      />
                    </Col>
                    <Col xs className="p-0">
                      <Form.Control
                        name="ladd"
                        size="sm"
                        type="text"
                        placeholder="ADD"
                        // value={ukuranBaru.ladd}
                        // onChange={(e) => handleChangeUbPower(e)}
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

export default TambahEceran;
