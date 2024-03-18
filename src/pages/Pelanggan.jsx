import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import TambahPelanggan from "../components/TambahPelanggan";

function Pelanggan() {
  const [showTambah, setShowTambah] = useState(false);

  const handleShowTambah = () => {
    setShowTambah(!showTambah);
  };
  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <h3>Daftar Pelanggan</h3>
        </Col>
        <Col className=" d-none d-sm-none d-md-block">
          <Button onClick={() => handleShowTambah()} className="float-end">
            Tambah Pelanggan
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={showTambah ? 6 : 12}>
          <Row>
            <Col md={6} className="mt-1">
              <InputGroup>
                <Form.Control
                  type="text"
                  id="search-data"
                  placeholder="Cari..."
                />
                <InputGroup.Text id="basic-addon2">
                  <Search />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Table hover size="md" responsive className="mt-2">
            <thead>
              <tr>
                <th className="p-2 bg-light">Nama</th>
                <th className="p-2 bg-light">Pelanggan Sejak</th>
                <th className="p-2 bg-light">Bulan Ini</th>
                <th className="p-2 bg-light">Lifetime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ahmad</td>
                <td>10-10-2020</td>
                <td>Rp 500.000</td>
                <td>Rp 1.500.000</td>
              </tr>
              <tr>
                <td>Ahmad</td>
                <td>10-10-2020</td>
                <td>Rp 500.000</td>
                <td>Rp 1.500.000</td>
              </tr>
              <tr>
                <td>Ahmad</td>
                <td>10-10-2020</td>
                <td>Rp 500.000</td>
                <td>Rp 1.500.000</td>
              </tr>
              <tr>
                <td>Ahmad</td>
                <td>10-10-2020</td>
                <td>Rp 500.000</td>
                <td>Rp 1.500.000</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={6} className={showTambah ? "d-block" : "d-none"}>
          <TambahPelanggan closeButton={handleShowTambah} />
        </Col>
      </Row>
    </Container>
  );
}

export default Pelanggan;
