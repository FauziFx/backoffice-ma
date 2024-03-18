import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay-ts";
import PulseLoader from "react-spinners/PulseLoader";
import Swal from "sweetalert2";

function TambahProduk({ closeButton, dataKategori, getDataProduk }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showTracking, setShowTracking] = useState(false);
  const handleClose = () => setShowTracking(false);
  const handleShow = () => setShowTracking(true);
  const [dataProduk, setDataProduk] = useState({
    nama_produk: "",
    id_kategori: "",
  });
  const [varianInputs, setVarianInputs] = useState([
    { nama_varian: "", stok: 0, stok_minimum: 0, harga: "", track_stok: "y" },
  ]);
  const [loadingTambahProduk, setLoadingTambahProduk] = useState(false);

  // Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handleAddInput = () => {
    setVarianInputs([
      ...varianInputs,
      { nama_varian: "", stok: 0, stok_minimum: 0, harga: "", track_stok: "y" },
    ]);
  };

  const handleChangeProduk = (e) => {
    setDataProduk((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeVarian = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...varianInputs];
    onChangeValue[index][name] = value;
    setVarianInputs(onChangeValue);
  };

  const handleDeleteInput = (index) => {
    const newArray = [...varianInputs];
    newArray.splice(index, 1);
    setVarianInputs(newArray);
  };

  const handleChangeCheck = (e, id) => {
    const { value, checked } = e.target;

    const newList = varianInputs.map((obj, index) => {
      // 👇️ if id equals 2, update country property
      if (index === id) {
        if (checked) {
          return { ...obj, track_stok: "y" };
        } else {
          return { ...obj, track_stok: "n" };
        }
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setVarianInputs(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingTambahProduk((value) => !value);
    try {
      const response = await axios.post(
        API + "produk",
        {
          nama_produk: dataProduk.nama_produk,
          id_kategori: dataProduk.id_kategori,
          varian: varianInputs,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );

      if (response.data.success == false) {
        localStorage.clear();
        return navigate("/login");
      } else {
        closeButton();
        getDataProduk();
        setLoadingTambahProduk((value) => !value);
        setDataProduk({
          nama_produk: "",
          id_kategori: "",
        });
        setVarianInputs([
          {
            nama_varian: "",
            stok: 0,
            stok_minimum: 0,
            harga: "",
            track_stok: "y",
          },
        ]);
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      setLoadingTambahProduk((value) => !value);
      console.log(error);
    }
  };

  return (
    <LoadingOverlay active={loadingTambahProduk} spinner={<PulseLoader />}>
      <Container>
        <Row>
          <Col
            md={12}
            sm={12}
            className="overflow-y-scroll"
            style={{ height: "550px" }}
          >
            <small className="mb-0">Informasi Produk</small>
            <hr style={{ margin: 0 }} />
            <Form className="mt-2" id="form-tambah" onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}>
                  Nama Produk <i className="text-danger">*</i>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    placeholder="Nama Produk"
                    name="nama_produk"
                    required
                    value={dataProduk.nama_produk}
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
                    value={dataProduk.id_kategori}
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
                onClick={() => handleAddInput()}
              >
                Tambah Varian
              </Button>
              <Button
                size="sm"
                variant="success"
                className="mt-2 ms-2"
                onClick={() => handleShow()}
              >
                Track Stok
              </Button>
              <Row className="mt-2 fw-semibold">
                <Col sm={8}>Nama Varian</Col>
                <Col sm={3}>Harga</Col>
              </Row>
              <div className="pt-3 pb-3">
                {varianInputs.map((item, index) => (
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
                      {varianInputs.length > 1 && (
                        <Button
                          size="sm"
                          variant="light"
                          className="text-danger pt-0"
                          onClick={() => handleDeleteInput(index)}
                        >
                          <XCircleFill />
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
              </div>

              {/* <div className="body"> {JSON.stringify(varianInputs)} </div> */}
              {/* Modal */}
              <Modal show={showTracking} onHide={handleClose} scrollable>
                <Modal.Header closeButton className="bg-primary">
                  <Modal.Title className="text-light">
                    Tracking Stok
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-1">
                  <Row className="fw-semibold mb-1 bg-grey py-2">
                    <Col sm={5}>Nama Varian</Col>
                    <Col sm={2}>Stok</Col>
                    <Col sm={2}>Alert</Col>
                    <Col sm={3}>Track Stok</Col>
                  </Row>
                  {varianInputs.map((item, index) => (
                    <Row
                      key={index}
                      style={{ borderBottom: "solid 1px #d6d9dc" }}
                      className="pb-1 mb-1"
                    >
                      <Col sm={5} className="pe-0 pt-2">
                        <p className="mb-0">{item.nama_varian}</p>
                      </Col>
                      <Col sm={2} className="px-0">
                        <Form.Control
                          name="stok"
                          type="number"
                          value={item.stok}
                          onChange={(event) => handleChangeVarian(event, index)}
                          placeholder=""
                        />
                      </Col>
                      <Col sm={2} className="px-0">
                        <Form.Control
                          name="stok_minimum"
                          type="number"
                          value={item.stok_minimum}
                          onChange={(event) => handleChangeVarian(event, index)}
                        />
                      </Col>
                      <Col sm={3} className="pt-2 ps-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="languages"
                          checked={item.track_stok === "y" ? true : false}
                          value="Javascript"
                          id="flexCheckDefault"
                          onChange={(event) => handleChangeCheck(event, index)}
                        />
                      </Col>
                    </Row>
                  ))}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => handleClose()}>
                    Tutup
                  </Button>
                  <Button onClick={() => handleClose()}>Konfirmasi</Button>
                </Modal.Footer>
              </Modal>
            </Form>
          </Col>
        </Row>
        <Button type="submit" form="form-tambah" className="float-end my-2">
          Simpan
        </Button>
        <Button
          variant="default"
          className="float-end border me-2 my-2"
          onClick={() => {
            closeButton();
            setVarianInputs([
              {
                nama_varian: "",
                stok: 0,
                stok_minimum: 0,
                harga: "",
                track_stok: "y",
              },
            ]);
          }}
        >
          Batal
        </Button>
      </Container>
    </LoadingOverlay>
  );
}

export default TambahProduk;
