import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
  Modal,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { XCircleFill } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import LoadingOverlay from "react-loading-overlay-ts";
import PulseLoader from "react-spinners/PulseLoader";

function TambahPenyesuaian({ closeButton, getDataPenyesuaian }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [catatan, setCatatan] = useState("");
  const [showListProduk, setShowListProduk] = useState(true);
  const [showListVarian, setShowListVarian] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
    setShowListProduk(true);
    setShowListVarian(false);
  };
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const handleShow = () => setShowModal(true);
  const [searchInput, setSearchInput] = useState("");
  const handleChangeSearch = (e) => {
    const search = e.target.value;
    setSearchInput(search);
    getDataProduk(search);
    setShowListProduk(true);
    setShowListVarian(false);
  };

  const [dataProduk, setDataProduk] = useState([]);
  const [dataProdukDetail, setDataProdukDetail] = useState({
    id: "",
    nama_produk: "",
    varian: [
      {
        id: "",
        nama_varian: "",
        stok_tersedia: "",
        stok_aktual: "",
      },
    ],
  });

  const [dataPenyesuaian, setDataPenyesuaian] = useState([
    {
      id: "",
      nama_produk: "",
      varian: [
        {
          id: "",
          nama_varian: "",
          stok_tersedia: "",
          stok_aktual: "",
        },
      ],
    },
  ]);

  const getDataProduk = async (search) => {
    try {
      const URL = API + "produk/track";
      const response = await axios.get(URL, {
        params: {
          search: search,
        },
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setDataProduk(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickRow = async (id_produk) => {
    try {
      let cek = dataPenyesuaian.find(function (el) {
        return el.id == id_produk;
      });
      if (cek === undefined) {
        setShowListProduk(false);
        setShowListVarian(true);
        const URL = API + "produk/" + id_produk;
        const response = await axios.get(URL, {
          params: {
            track_status: "y",
          },
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        });
        setDataProdukDetail({
          id: response.data.data.id,
          nama_produk: response.data.data.nama_produk,
          varian: response.data.data.varian,
        });
      } else {
        Swal.fire({
          position: "top",
          icon: "warning",
          title: "Oops..",
          text: "Item ini sudah ditambahkan, buka tabel Penyesuaian stok untuk mengedit",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDetail = (event, index) => {
    let { value } = event.target;
    if (!isNaN(+value)) {
      let onChangeValue = [...dataProdukDetail.varian];
      onChangeValue[index]["stok_aktual"] = value;
      onChangeValue[index]["penyesuaian"] =
        value - onChangeValue[index]["stok_tersedia"];
      setDataProdukDetail((prevState) => ({
        ...prevState,
        varian: onChangeValue,
      }));
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (dataPenyesuaian[0].nama_produk == "") {
      setDataPenyesuaian([dataProdukDetail]);
    } else {
      setDataPenyesuaian([...dataPenyesuaian, dataProdukDetail]);
    }

    setDataProdukDetail({
      id: "",
      nama_produk: "",
      varian: [
        {
          id: "",
          nama_varian: "",
          stok_tersedia: "",
          stok_aktual: "",
          penyesuaian: "",
        },
      ],
    });
    handleClose();
  };

  const handleChangePenyesuaian = (e, produkId, produkIndex, varianIndex) => {
    let { value } = e.target;
    if (!isNaN(+value)) {
      let onChangeValue = [...dataPenyesuaian[produkIndex].varian];
      onChangeValue[varianIndex]["stok_aktual"] = value;
      onChangeValue[varianIndex]["penyesuaian"] =
        value - onChangeValue[varianIndex]["stok_tersedia"];
      setDataPenyesuaian((prev) =>
        prev.map((el) =>
          el.id === produkId
            ? {
                ...el,
                varian: onChangeValue,
              }
            : el
        )
      );
    }
  };

  const handleDeletePenyesuaian = (index) => {
    if (dataPenyesuaian.length == 1) {
      setDataPenyesuaian([
        {
          id: "",
          nama_produk: "",
          varian: [
            {
              id: "",
              nama_varian: "",
              stok_tersedia: "",
              stok_aktual: "",
              penyesuaian: "",
            },
          ],
        },
      ]);
    } else {
      const newArray = [...dataPenyesuaian];
      newArray.splice(index, 1);
      setDataPenyesuaian(newArray);
    }
  };

  const handleSubmitPenyesuaian = async (e) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      const flatten = (array) =>
        dataPenyesuaian
          .reduce(
            (results, item) => [
              ...results,
              ...item.varian.map((varian) => ({
                id_produk: item.id,
                id_varian: varian.id,
                nama_produk: item.nama_produk + " - " + varian.nama_varian,
                stok_tersedia: varian.stok_tersedia,
                stok_aktual: varian.stok_aktual,
                penyesuaian: varian.penyesuaian,
                catatan: catatan,
              })),
            ],
            []
          )
          .filter((item) => item.penyesuaian != 0);

      const URL = API + "penyesuaian";
      const response = await axios.post(
        URL,
        {
          data: flatten(dataPenyesuaian),
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
        setCatatan("");
        setDataPenyesuaian([
          {
            id: "",
            nama_produk: "",
            varian: [
              {
                id: "",
                nama_varian: "",
                stok_tersedia: "",
                stok_aktual: "",
              },
            ],
          },
        ]);
        setLoadingSubmit(false);
        closeButton();
        getDataPenyesuaian();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataProduk();
  }, []);

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

  return (
    <LoadingOverlay active={loadingSubmit} spinner={<PulseLoader />}>
      <Container>
        <Row>
          <Col
            md={12}
            sm={12}
            className="overflow-y-scroll"
            style={{ height: "550px" }}
          >
            <small className="mb-0">Informasi</small>
            <hr style={{ margin: 0 }} />
            <Form
              className="mt-2"
              id="formSubmitPenyesuaian"
              onSubmit={handleSubmitPenyesuaian}
            >
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}>
                  Catatan
                </Form.Label>
                <Col sm={9}>
                  <FloatingLabel controlId="floatingTextarea2" label="Catatan">
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      style={{ height: "100px" }}
                      name="catatan"
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                    />
                  </FloatingLabel>
                </Col>
              </Form.Group>

              <small className="mb-0">Tabel Penyesuaian Stok</small>
              <hr style={{ margin: 0 }} />

              <Button
                size="sm"
                variant="success"
                className="mt-2 ms-2 w-100"
                onClick={handleShow}
              >
                Tambah Item
              </Button>

              <Row className="mt-2 fw-semibold">
                <Col sm={3}>Varian</Col>
                <Col sm={3}>Stok Tersedia</Col>
                <Col sm={3}>Stok Aktual</Col>
                <Col sm={3}>Penyesuaian</Col>
              </Row>

              {dataPenyesuaian[0].nama_produk != ""
                ? dataPenyesuaian.map((produk, produkIndex) => (
                    <Row className="my-2 " key={produkIndex}>
                      <Row>
                        <div className="input-group">
                          <Form.Control
                            className="bg-white text-center fw-semibold"
                            type="text"
                            value={produk.nama_produk}
                            style={{ cursor: "not-allowed" }}
                            disabled
                          />
                          <span className="input-group-text bg-white rounded-0">
                            <a
                              href="#"
                              className="text-danger"
                              onClick={() =>
                                handleDeletePenyesuaian(produkIndex)
                              }
                            >
                              <XCircleFill />
                            </a>
                          </span>
                        </div>
                      </Row>
                      {produk.varian.map((varian, varianIndex) => (
                        <Row key={varianIndex}>
                          <Col sm={3} className="pe-0">
                            <Form.Control
                              className="bg-white text-secondary"
                              name="nama_varian"
                              type="text"
                              value={varian.nama_varian}
                              onChange={(e) => handleChangePenyesuaian(e)}
                              style={{ cursor: "not-allowed" }}
                              disabled
                            />
                          </Col>
                          <Col sm={3} className="px-0">
                            <Form.Control
                              className="bg-white text-secondary"
                              name="stok_tersedia"
                              type="number"
                              value={varian.stok_tersedia}
                              onChange={(e) => handleChangePenyesuaian(e)}
                              style={{ cursor: "not-allowed" }}
                              disabled
                            />
                          </Col>
                          <Col sm={3} className="px-0">
                            <Form.Control
                              name="stok_aktual"
                              value={varian.stok_aktual}
                              onChange={(e) =>
                                handleChangePenyesuaian(
                                  e,
                                  produk.id,
                                  produkIndex,
                                  varianIndex
                                )
                              }
                              type="text"
                              required
                            />
                          </Col>
                          <Col sm={3} className="ps-0">
                            <Form.Control
                              className="bg-white text-secondary"
                              name="penyesuaian"
                              value={
                                varian.penyesuaian > 0
                                  ? "+" + "" + varian.penyesuaian
                                  : varian.penyesuaian
                              }
                              onChange={(e) => handleChangePenyesuaian(e)}
                              type="text"
                              disabled
                            />
                          </Col>
                        </Row>
                      ))}
                    </Row>
                  ))
                : ""}
            </Form>
          </Col>
        </Row>
        <Button
          type="submit"
          className="float-end my-2"
          form="formSubmitPenyesuaian"
          disabled={dataPenyesuaian[0].id === ""}
        >
          Simpan
        </Button>
        <Button
          variant="default"
          className="float-end border me-2 my-2"
          onClick={() => {
            closeButton();
            setDataPenyesuaian([
              {
                id: "",
                nama_produk: "",
                varian: [
                  {
                    id: "",
                    nama_varian: "",
                    stok_tersedia: "",
                    stok_aktual: "",
                  },
                ],
              },
            ]);
          }}
        >
          Batal
        </Button>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose} size="lg" scrollable>
          <Modal.Header closeButton className="bg-primary">
            <Modal.Title className="text-light">Tambah Item </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-2">
            <Form.Control
              type="text"
              id="search-data"
              value={searchInput}
              onChange={(e) => handleChangeSearch(e)}
              placeholder="Cari..."
              autoFocus
            />
            <ListGroup
              className={showListProduk ? "d-block mt-2 rounded-0" : "d-none"}
            >
              {dataProduk.map((item, index) => (
                <ListGroup.Item
                  className="mb-1"
                  action
                  key={index}
                  onClick={() => handleClickRow(item.id)}
                >
                  {item.nama_produk}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className={showListVarian ? "d-block mt-2" : "d-none"}>
              <Row className="mt-3">
                <Col sm={12} className="fw-bold mb-2">
                  {dataProdukDetail.nama_produk}
                </Col>
                <Col sm={6} className="fw-semibold text-center">
                  Item
                </Col>
                <Col sm={3} className="fw-semibold text-center">
                  Stok Tersedia
                </Col>
                <Col sm={3} className="fw-semibold text-center">
                  Stok Aktual
                </Col>
                <Col sm={12}>
                  <Form id="formDetail" onSubmit={handleAddItem}>
                    {dataProdukDetail.varian.map((item, index) => (
                      <Row key={index}>
                        <Col sm={6} className="pe-0">
                          <Form.Control
                            className="bg-white text-secondary"
                            name="nama_varian"
                            type="text"
                            value={item.nama_varian}
                            onChange={(e) => handleChangeDetail(e, index)}
                            style={{ cursor: "not-allowed" }}
                            disabled
                          />
                        </Col>
                        <Col sm={3} className="px-0">
                          <Form.Control
                            className="bg-white text-secondary"
                            name="stok_tersedia"
                            type="number"
                            value={item.stok_tersedia}
                            onChange={(e) => handleChangeDetail(e, index)}
                            style={{ cursor: "not-allowed" }}
                            disabled
                          />
                        </Col>
                        <Col sm={3} className="ps-0">
                          <Form.Control
                            name="stok_aktual"
                            value={item.stok_aktual}
                            onChange={(e) => handleChangeDetail(e, index)}
                            type="text"
                            required
                          />
                        </Col>
                      </Row>
                    ))}
                  </Form>
                </Col>
              </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleClose()}>
              Tutup
            </Button>
            <Button type="submit" form="formDetail">
              Tambah
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </LoadingOverlay>
  );
}

export default TambahPenyesuaian;
