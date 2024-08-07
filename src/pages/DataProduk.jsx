import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Form,
  InputGroup,
  Table,
  Badge,
  Modal,
  Card,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Search, XCircleFill, Trash3Fill } from "react-bootstrap-icons";
import TambahProduk from "../components/TambahProduk";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";
import PulseLoader from "react-spinners/PulseLoader";
import Swal from "sweetalert2";

function DataProduk() {
  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showVarianBaru, setShowVarianBaru] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataProduk, setDataProduk] = useState([]);
  const [dataKategori, setDataKategori] = useState([]);
  const [selectKategori, setSelectKategori] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loadingDataProduk, setLoadingDataProduk] = useState(true);
  const [loadingUpdateProduk, setLoadingUpdateProduk] = useState(false);
  const [deletedVarian, setDeletedVarian] = useState([]);
  const [varianBaru, setVarianBaru] = useState([
    {
      nama_varian_baru: "",
      stok_baru: 0,
      stok_minimum_baru: 0,
      harga_baru: "",
      track_stok_baru: "y",
    },
  ]);
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
  const [showTracking, setShowTracking] = useState(false);
  const handleClose = () => setShowTracking(false);
  const handleShow = () => setShowTracking(true);

  const getDataProduk = async (kategori, search) => {
    try {
      const URL = API + "produk";
      const response = await axios.get(URL, {
        params: {
          kategori: kategori,
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
        setLoadingDataProduk(false);
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

  const getProdukDetail = async (id_produk) => {
    try {
      const URL = API + "produk/" + id_produk;
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

  const deleteProduk = async (id_produk) => {
    try {
      const URL = API + "produk/" + id_produk;
      const response = await axios.delete(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        getDataProduk();
        setShowDetail(false);
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowTambah = () => {
    setShowTambah((value) => !value);
    setShowDetail(false);
  };

  const handleChangeKategori = (e) => {
    const idKategori = e.target.value;
    setSelectKategori(idKategori);
    setSearchInput("");
    getDataProduk(idKategori);
  };

  const handleChangeSearch = (e) => {
    const search = e.target.value;
    setSelectKategori("");
    setSearchInput(search);
    getDataProduk("", search);
  };

  const handleClickRow = (id_produk) => {
    setVarianBaru([
      {
        nama_varian_baru: "",
        stok_baru: 0,
        stok_minimum_baru: 0,
        harga_baru: "",
        track_stok_baru: "y",
      },
    ]);
    setShowVarianBaru(false);
    setShowDetail(true);
    setShowTambah(false);
    getProdukDetail(id_produk);
  };

  // --- Detail Varian Baru ---
  const handleChangeVarianBaru = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...varianBaru];
    onChangeValue[index][name] = value;
    setVarianBaru(onChangeValue);
  };

  const handleAddVarianBaru = () => {
    if (showVarianBaru) {
      setVarianBaru([
        ...varianBaru,
        {
          nama_varian_baru: "",
          stok_baru: 0,
          stok_minimum_baru: 0,
          harga_baru: "",
          track_stok_baru: "y",
        },
      ]);
    } else {
      setShowVarianBaru(true);
    }
  };

  const handleChangeCheckVarianBaru = (e, id) => {
    const { value, checked } = e.target;

    const newList = varianBaru.map((obj, index) => {
      // 👇️ if id equals 2, update country property
      if (index === id) {
        if (checked) {
          return { ...obj, track_stok_baru: "y" };
        } else {
          return { ...obj, track_stok_baru: "n" };
        }
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setVarianBaru(newList);
  };

  const handleDeleteVarianbaru = (index) => {
    if (varianBaru.length == 1) {
      setShowVarianBaru(false);
      setVarianBaru([
        {
          nama_varian_baru: "",
          stok_baru: 0,
          stok_minimum_baru: 0,
          harga_baru: "",
          track_stok_baru: "y",
        },
      ]);
    } else {
      const newArray = [...varianBaru];
      newArray.splice(index, 1);
      setVarianBaru(newArray);
    }
  };

  // Detail dan Tambah
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

  const handleDeleteVarian = (index, id_varian) => {
    const newList = [...produkDetail.varian];
    newList.splice(index, 1);
    setProdukDetail((prevState) => ({
      ...prevState,
      varian: newList,
    }));
    setDeletedVarian((prevState) => [...prevState, id_varian]);
  };

  const handleChangeCheck = (e, id) => {
    const { value, checked } = e.target;

    const newList = produkDetail.varian.map((obj, index) => {
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
    setProdukDetail((prevState) => ({
      ...prevState,
      varian: newList,
    }));
  };

  const handleClickHapusProduk = async (id_produk) => {
    Swal.fire({
      title: "Kamu Yakin?",
      text: "Data tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduk(id_produk);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdateProduk(true);
      const URL_DELETE = API + "produk/varian";
      const URL_UPDATE = API + "produk/" + produkDetail.id;

      let varian_baru = [];
      if (varianBaru[0].nama_varian_baru != "") {
        varianBaru.map((item, i) => {
          const partialObj = {};
          partialObj.nama = produkDetail.nama_produk.split("(")[0];
          partialObj.nama_varian = item.nama_varian_baru;
          partialObj.stok = item.stok_baru;
          partialObj.stok_minimum = item.stok_minimum_baru;
          partialObj.harga = item.harga_baru;
          partialObj.track_stok = item.track_stok_baru;

          varian_baru.push(partialObj);
        });
      } else {
        varian_baru = "";
      }

      const responseDelete = await axios.delete(URL_DELETE, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
        data: {
          id_varian: deletedVarian,
        },
      });

      const responseUpdate = await axios.put(
        URL_UPDATE,
        {
          nama_produk: produkDetail.nama_produk,
          id_kategori: produkDetail.id_kategori,
          varian: produkDetail.varian,
          varian_baru: varian_baru,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );
      if (responseUpdate.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setLoadingUpdateProduk(false);
        getDataProduk();
        setDeletedVarian([]);
        setVarianBaru([
          {
            nama_varian_baru: "",
            stok_baru: 0,
            stok_minimum_baru: 0,
            harga_baru: "",
            track_stok_baru: "y",
          },
        ]);
        getProdukDetail(produkDetail.id);
        setShowVarianBaru(false);
        Toast.fire({
          icon: "success",
          title: responseUpdate.data.message,
        });
      }
    } catch (error) {
      setLoadingUpdateProduk((value) => !value);
      console.log(error);
    }
  };

  useEffect(() => {
    getDataProduk();
    getDataKategori();
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
    <Container className="pt-4 title-page">
      <Row className="p-2 text-white bg-primary shadow-sm mx-1">
        <Col className="pt-1">
          <h4 className="mb-0">Produk</h4>
        </Col>
        <Col className="d-none d-sm-none d-md-block">
          <span className="float-end">
            {/* <Dropdown className="btn-group me-1" role="group">
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Import / Export
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Import Data</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Export Data</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            <Button onClick={() => handleShowTambah()}>Tambah Produk</Button>
          </span>
        </Col>
      </Row>

      <Row>
        <Col md={showTambah || showDetail ? 6 : 12}>
          <Row>
            <Col md={6} className="mt-1">
              <Form.Select
                aria-label="Default select example"
                value={selectKategori}
                onChange={(e) => handleChangeKategori(e)}
              >
                <option value="">Semua Kategori</option>
                <option value="0">Uncategorized</option>
                {dataKategori.map((item, index) => (
                  <option key={index} value={item.id == null ? "" : item.id}>
                    {item.nama_kategori}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} className="mt-1">
              <InputGroup>
                <Form.Control
                  type="text"
                  id="search-data"
                  value={searchInput}
                  onChange={(e) => handleChangeSearch(e)}
                  placeholder="Cari..."
                />
                <InputGroup.Text id="basic-addon2">
                  <Search />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Card className="mt-1">
            <Card.Body>
              <LoadingOverlay
                active={loadingDataProduk}
                spinner={<PulseLoader />}
              >
                <Table hover size="md" responsive className="mt-2 table-fixed">
                  <thead>
                    <tr>
                      <th className="p-2 bg-light">Nama</th>
                      <th className="p-2 bg-light">Kategori</th>
                      <th className="p-2 bg-light">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataProduk.map((item, index) => (
                      <tr key={index} onClick={() => handleClickRow(item.id)}>
                        <td>{item.nama_produk}</td>
                        <td>{item.nama_kategori}</td>
                        <td>
                          <Badge bg={item.stok < 1 ? "warning" : "success"}>
                            Stok :{item.stok}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </LoadingOverlay>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className={showTambah ? "d-block" : "d-none"}>
          <TambahProduk
            closeButton={handleShowTambah}
            dataKategori={dataKategori}
            getDataProduk={getDataProduk}
          />
        </Col>
        <Col md={6} className={showDetail ? "d-block" : "d-none"}>
          <LoadingOverlay
            active={loadingUpdateProduk}
            spinner={<PulseLoader />}
          >
            <Container>
              <Row>
                <Col
                  md={12}
                  sm={12}
                  className="overflow-y-scroll px-0"
                  style={{ height: "550px" }}
                >
                  <Card className="mt-1">
                    <Card.Body>
                      <small className="mb-0">Informasi Produk</small>
                      <hr style={{ margin: 0 }} />
                      <Form
                        className="mt-2"
                        id="form-detail"
                        onSubmit={handleSubmit}
                      >
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
                              required
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
                          onClick={() => handleAddVarianBaru()}
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
                          {produkDetail.varian.map((item, index) => (
                            <Row key={index}>
                              <Col sm={8} className="pe-0">
                                <Form.Control
                                  name="nama_varian"
                                  type="text"
                                  value={item.nama_varian}
                                  onChange={(event) =>
                                    handleChangeVarian(event, index)
                                  }
                                  placeholder="Nama Varian"
                                  required
                                />
                              </Col>
                              <Col sm={3} className="px-0">
                                <Form.Control
                                  name="harga"
                                  type="number"
                                  value={item.harga}
                                  onChange={(event) =>
                                    handleChangeVarian(event, index)
                                  }
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
                                    onClick={() =>
                                      handleDeleteVarian(index, item.id)
                                    }
                                  >
                                    <XCircleFill />
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                          {showVarianBaru &&
                            varianBaru.map((item, index) => (
                              <Row key={index}>
                                <Col sm={8} className="pe-0">
                                  <Form.Control
                                    name="nama_varian_baru"
                                    type="text"
                                    value={item.nama_varian_baru}
                                    onChange={(event) =>
                                      handleChangeVarianBaru(event, index)
                                    }
                                    placeholder="Nama Varian"
                                    required
                                  />
                                </Col>
                                <Col sm={3} className="px-0">
                                  <Form.Control
                                    name="harga_baru"
                                    type="number"
                                    value={item.harga_baru}
                                    onChange={(event) =>
                                      handleChangeVarianBaru(event, index)
                                    }
                                    placeholder="Harga"
                                    required
                                  />
                                </Col>
                                <Col sm={1} className="ps-0 pt-1">
                                  <Button
                                    size="sm"
                                    variant="light"
                                    className="text-danger pt-0"
                                    onClick={() =>
                                      handleDeleteVarianbaru(index)
                                    }
                                  >
                                    <XCircleFill />
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                        </div>

                        {/* Modal */}
                        <Modal
                          show={showTracking}
                          onHide={handleClose}
                          scrollable
                        >
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
                            {produkDetail.varian.map((item, index) => (
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
                                    style={{ cursor: "not-allowed" }}
                                    value={item.stok}
                                    onChange={(event) =>
                                      handleChangeVarian(event, index)
                                    }
                                    placeholder=""
                                    className="bg-grey"
                                    disabled
                                  />
                                </Col>
                                <Col sm={2} className="px-0">
                                  <Form.Control
                                    name="stok_minimum"
                                    type="number"
                                    value={item.stok_minimum}
                                    onChange={(event) =>
                                      handleChangeVarian(event, index)
                                    }
                                  />
                                </Col>
                                <Col sm={3} className="pt-2 ps-4">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="languages"
                                    checked={
                                      item.track_stok === "y" ? true : false
                                    }
                                    value="Javascript"
                                    id="flexCheckDefault"
                                    onChange={(event) =>
                                      handleChangeCheck(event, index)
                                    }
                                  />
                                </Col>
                              </Row>
                            ))}
                            {showVarianBaru &&
                              varianBaru.map((item, index) => (
                                <Row
                                  key={index}
                                  style={{ borderBottom: "solid 1px #d6d9dc" }}
                                  className="pb-1 mb-1"
                                >
                                  <Col sm={5} className="pe-0 pt-2">
                                    <p className="mb-0">
                                      {item.nama_varian_baru}
                                    </p>
                                  </Col>
                                  <Col sm={2} className="px-0">
                                    <Form.Control
                                      name="stok_baru"
                                      type="number"
                                      style={{ cursor: "not-allowed" }}
                                      value={item.stok_baru}
                                      onChange={(event) =>
                                        handleChangeVarianBaru(event, index)
                                      }
                                      placeholder=""
                                      className="bg-grey"
                                      disabled
                                    />
                                  </Col>
                                  <Col sm={2} className="px-0">
                                    <Form.Control
                                      name="stok_minimum_baru"
                                      type="number"
                                      value={item.stok_minimum_baru}
                                      onChange={(event) =>
                                        handleChangeVarianBaru(event, index)
                                      }
                                    />
                                  </Col>
                                  <Col sm={3} className="pt-2 ps-4">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name="languages"
                                      checked={
                                        item.track_stok_baru === "y"
                                          ? true
                                          : false
                                      }
                                      value="Javascript"
                                      id="flexCheckDefault"
                                      onChange={(event) =>
                                        handleChangeCheckVarianBaru(
                                          event,
                                          index
                                        )
                                      }
                                    />
                                  </Col>
                                </Row>
                              ))}
                          </Modal.Body>
                          <Modal.Footer className="justify-content-between">
                            <small className="fw-light">
                              Gunakan *
                              <Link to="/produk/penyesuaian-stok">
                                Penyesuaian stok&nbsp;
                              </Link>
                              Untuk mengelola stok
                            </small>
                            <Button onClick={() => handleClose()}>
                              Konfirmasi
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <div className="d-flex justify-content-between">
                <div>
                  <Button
                    variant="danger"
                    className="my-2"
                    onClick={() => handleClickHapusProduk(produkDetail.id)}
                  >
                    <Trash3Fill />
                  </Button>
                </div>
                <div>
                  <Button
                    variant="default"
                    className="border me-2 my-2"
                    onClick={() => setShowDetail(false)}
                  >
                    Tutup
                  </Button>
                  <Button type="submit" form="form-detail" className="my-2">
                    Simpan
                  </Button>
                </div>
              </div>
            </Container>
          </LoadingOverlay>
        </Col>
      </Row>
    </Container>
  );
}

export default DataProduk;
