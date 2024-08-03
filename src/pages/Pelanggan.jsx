import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Table,
  Card,
} from "react-bootstrap";
import { Search, Trash3Fill } from "react-bootstrap-icons";
import TambahPelanggan from "../components/TambahPelanggan";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import Swal from "sweetalert2";

function Pelanggan() {
  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataPelanggan, setDatapelanggan] = useState([]);
  const [pelangganDetail, setPelangganDetail] = useState({
    id: "",
    nama_pelanggan: "",
    nohp: "",
    tanggal: "",
  });
  const [searchInput, setSearchInput] = useState("");

  const handleShowTambah = () => {
    setShowTambah(!showTambah);
    setShowDetail(false);
  };

  const handleClickRow = (id_pelanggan) => {
    getPelangganDetail(id_pelanggan);
    setShowDetail(true);
    setShowTambah(false);
  };

  const handleChangeSearch = (e) => {
    const search = e.target.value;
    setSearchInput(search);
    getDataPelanggan(search);
  };

  const handleClickHapus = async (id_pelanggan) => {
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
        deletePelanggan(id_pelanggan);
      }
    });
  };

  const getDataPelanggan = async (search) => {
    try {
      const URL = API + "pelanggan";
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
        setDatapelanggan(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPelangganDetail = async (id_pelanggan) => {
    try {
      const detail = dataPelanggan.find((item) => item.id == id_pelanggan);
      setPelangganDetail({
        id: detail.id,
        nama_pelanggan: detail.nama_pelanggan,
        nohp: detail.nohp || "",
        tanggal: detail.tanggal,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deletePelanggan = async (id_pelanggan) => {
    try {
      const URL = API + "pelanggan/" + id_pelanggan;
      const response = await axios.delete(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        getDataPelanggan();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = API + "pelanggan/" + pelangganDetail.id;
      const response = await axios.put(
        URL,
        {
          nama_pelanggan: pelangganDetail.nama_pelanggan,
          nohp: pelangganDetail.nohp,
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
        getDataPelanggan();
        setShowDetail(false);
        setPelangganDetail({
          id: "",
          nama_pelanggan: "",
          nohp: "",
          tanggal: "",
        });
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
    getDataPelanggan();
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
    <Container className="pt-4">
      <Row className="p-2 text-white bg-primary shadow-sm mx-1">
        <Col className="pt-1">
          <h4 className="mb-0">Daftar Pelanggan</h4>
        </Col>
        <Col className=" d-none d-sm-none d-md-block">
          <Button onClick={() => handleShowTambah()} className="float-end">
            Tambah Pelanggan
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={showTambah || showDetail ? 6 : 12}>
          <Row>
            <Col md={6} className="mt-1">
              <InputGroup>
                <Form.Control
                  type="text"
                  id="search-data"
                  placeholder="Cari..."
                  autoComplete="off"
                  value={searchInput}
                  onChange={(e) => handleChangeSearch(e)}
                />
                <InputGroup.Text id="basic-addon2">
                  <Search />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Card className="mt-1">
            <Card.Body>
              <Table hover size="md" responsive className="mt-2">
                <thead>
                  <tr>
                    <th className="p-2 bg-light">#</th>
                    <th className="p-2 bg-light">Nama</th>
                    <th className="p-2 bg-light">No HP</th>
                    <th className="p-2 bg-light">Pelanggan Sejak</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPelanggan.map((item, index) => (
                    <tr key={index} onClick={() => handleClickRow(item.id)}>
                      <td>{index + 1}</td>
                      <td>{item.nama_pelanggan}</td>
                      <td>{item.nohp || "-"}</td>
                      <td>{moment(item.tanggal).format("DD MMMM YYYY")}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className={showTambah ? "d-block" : "d-none"}>
          <TambahPelanggan
            closeButton={handleShowTambah}
            getDataPelanggan={getDataPelanggan}
          />
        </Col>
        <Col md={6} className={showDetail ? "d-block" : "d-none"}>
          <Container>
            <Card className="mt-1">
              <Card.Body>
                <small className="mb-0">Informasi</small>
                <hr style={{ margin: 0 }} />
                <Form
                  className="mt-2"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={3}>
                      Nama Pelanggan <i className="text-danger">*</i>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Nama Pelanggan"
                        value={pelangganDetail.nama_pelanggan}
                        onChange={(e) =>
                          setPelangganDetail((prevState) => ({
                            ...prevState,
                            nama_pelanggan: e.target.value,
                          }))
                        }
                        autoComplete="off"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={3}>
                      No Hp
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="No Hp"
                        value={pelangganDetail.nohp}
                        onChange={(e) =>
                          setPelangganDetail((prevState) => ({
                            ...prevState,
                            nohp: e.target.value || "",
                          }))
                        }
                        autoComplete="off"
                      />
                    </Col>
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Button
                        variant="danger"
                        className="my-2"
                        onClick={() => handleClickHapus(pelangganDetail.id)}
                      >
                        <Trash3Fill />
                      </Button>
                    </div>
                    <div>
                      <Button type="submit" className="float-end mt-2">
                        Simpan
                      </Button>
                      <Button
                        variant="default"
                        className="float-end border me-2 my-2"
                        onClick={() => setShowDetail(false)}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default Pelanggan;
