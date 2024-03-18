import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { XCircleFill } from "react-bootstrap-icons";

function DataProdukDetail() {
  const location = useLocation();
  const idProduk = location.state.id;
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataKategori, setDataKategori] = useState([]);
  const [produkDetail, setProdukDetail] = useState({
    id: "",
    nama_produk: "",
    id_kategori: "",
    varian: [
      {
        id: "",
        stok: "",
        harga: "",
        track_stok: "",
        nama_varian: "",
        stok_minimum: "",
      },
    ],
  });

  const getProdukDetail = async () => {
    try {
      const URL = API + "produk/" + idProduk;
      const response = await axios.get(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setProdukDetail(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataKategori = async () => {
    try {
      const URL = API + "kategori";
      const response = await axios.get(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setDataKategori(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeProduk = (e) => {
    setProdukDetail((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeVarian = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...produkDetail.varian];
    onChangeValue[index][name] = value;
    setProdukDetail((prevState) => ({
      ...prevState,
      varian: onChangeValue,
    }));
  };

  useEffect(() => {
    getProdukDetail();
    getDataKategori();
  }, []);

  return (
    <Container className="pt-4">
      <Row>
        <Row>
          <Col md={6} sm={12}>
            <h3 className="float-start">Produk Detail</h3>
            <Link
              to="/produk/data-produk"
              className="btn btn-primary float-end"
            >
              Kembali
            </Link>
          </Col>
        </Row>
        <Col md={6}>
          <small className="mb-0">Informasi Produk</small>
          <hr style={{ margin: 0 }} />
          <Form className="mt-2">
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={3}>
                Nama Produk <i className="text-danger">*</i>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="nama_produk"
                  placeholder="Nama Produk"
                  value={produkDetail.nama_produk}
                  onChange={(e) => handleChangeProduk(e)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>
                Kategori
              </Form.Label>
              <Col sm={9}>
                <Form.Select
                  aria-label="Default select example"
                  name="id_kategori"
                  value={produkDetail.id_kategori}
                  onChange={(e) => handleChangeProduk(e)}
                >
                  <option value="">Uncategorized</option>
                  {dataKategori.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.nama_kategori}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <small className="mb-0">Varian Produk</small>
            <hr style={{ margin: 0 }} />

            <Button
              size="sm"
              className="mt-2"
              //  onClick={() => handleAddInput()}
            >
              Tambah Varian
            </Button>
            <Button
              size="sm"
              variant="success"
              className="mt-2 ms-2"
              //   onClick={() => handleShow()}
            >
              Track Stok
            </Button>
            <Row className="mt-2 fw-semibold">
              <Col sm={8}>Nama Varian</Col>
              <Col sm={3}>Harga</Col>
            </Row>
            <div className="pt-3 pb-3">
              {produkDetail.varian.map((item, index) => (
                <Row key={index}>
                  <Col sm={8} className="pe-0">
                    <Form.Control
                      name="nama_varian"
                      type="text"
                      value={item.nama_varian}
                      onChange={(event) => handleChangeVarian(event, index)}
                      placeholder="Nama Varian"
                      required
                    />
                  </Col>
                  <Col sm={3} className="px-0">
                    <Form.Control
                      name="harga"
                      type="number"
                      value={item.harga}
                      onChange={(event) => handleChangeVarian(event, index)}
                      placeholder="Harga"
                      required
                    />
                  </Col>
                  <Col sm={1} className="ps-0 pt-1">
                    {produkDetail.varian.length > 1 && (
                      <Button
                        size="sm"
                        variant="light"
                        className="text-danger pt-0"
                        // onClick={() => handleDeleteInput(index)}
                      >
                        <XCircleFill />
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default DataProdukDetail;
