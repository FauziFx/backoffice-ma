import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { Search, Trash3Fill } from "react-bootstrap-icons";
import TambahAkun from "../components/TambahAkun";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import Swal from "sweetalert2";

function PengaturanAkun() {
  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataAkun, setDataAkun] = useState([]);
  const [akunDetail, setAkunDetail] = useState({
    id: "",
    nama: "",
    username: "",
    password: "",
    role: "",
  });
  const [searchInput, setSearchInput] = useState("");

  const handleShowTambah = () => {
    setShowTambah(!showTambah);
    setShowDetail(false);
  };

  const handleClickRow = (id_user) => {
    getAkunDetail(id_user);
    setShowDetail(true);
    setShowTambah(false);
  };

  const handleChangeSearch = (e) => {
    const search = e.target.value;
    setSearchInput(search);
    getDataAkun(search);
  };

  const handleClickHapus = async (id_user) => {
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
        deleteAkun(id_user);
      }
    });
  };

  const getDataAkun = async (search) => {
    try {
      const URL = API + "user";
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
        setDataAkun(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAkunDetail = async (id_user) => {
    try {
      const detail = dataAkun.find((item) => item.id == id_user);
      setAkunDetail({
        id: detail.id,
        nama: detail.nama,
        username: detail.username,
        role: detail.role,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAkun = async (id_user) => {
    try {
      const URL = API + "user/" + id_user;
      const response = await axios.delete(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        getDataAkun();
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
      const URL = API + "user/" + akunDetail.id;
      const response = await axios.put(
        URL,
        {
          nama: akunDetail.nama,
          username: akunDetail.nohp,
          password: akunDetail.password,
          role: akunDetail.role,
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
        getDataAkun();
        setShowDetail(false);
        setAkunDetail({
          id: "",
          nama: "",
          username: "",
          password: "",
          role: "",
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
    getDataAkun();
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
          <Table hover size="md" responsive className="mt-2">
            <thead>
              <tr>
                <th className="p-2 bg-light">#</th>
                <th className="p-2 bg-light">Nama</th>
                <th className="p-2 bg-light">Username</th>
                <th className="p-2 bg-light">Role</th>
              </tr>
            </thead>
            <tbody>
              {dataAkun.map((item, index) => (
                <tr key={index} onClick={() => handleClickRow(item.id)}>
                  <td>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.username}</td>
                  <td>{item.role}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={6} className={showTambah ? "d-block" : "d-none"}>
          <TambahAkun
            closeButton={handleShowTambah}
            // getDataPelanggan={getDataPelanggan}
          />
        </Col>
        <Col md={6} className={showDetail ? "d-block" : "d-none"}>
          {/* <Container>
            <small className="mb-0">Informasi</small>
            <hr style={{ margin: 0 }} />
            <Form className="mt-2" onSubmit={handleSubmit} autoComplete="off">
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
          </Container> */}
        </Col>
      </Row>
    </Container>
  );
}

export default PengaturanAkun;
