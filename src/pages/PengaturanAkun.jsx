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
import "moment/dist/locale/id";
import Swal from "sweetalert2";

function PengaturanAkun({ dataUser }) {
  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataAkun, setDataAkun] = useState([]);
  const [dataOptik, setDataOptik] = useState([]);
  const [akunDetail, setAkunDetail] = useState({
    id: "",
    nama: "",
    username: "",
    password: "",
    role: "",
    id_optik: "",
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

  const handleChange = (e) => {
    setAkunDetail((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
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

      const optik = await axios.get(API + "optik");
      setDataOptik(optik.data.data);
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
        password: "",
        role: detail.role,
        id_optik: detail.id_optik,
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
          username: akunDetail.username,
          password: akunDetail.password,
          role: akunDetail.role,
          id_optik: akunDetail.id_optik,
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
          id_optik: "",
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
          <h3>Daftar Akun</h3>
        </Col>
        <Col className=" d-none d-sm-none d-md-block">
          <Button onClick={() => handleShowTambah()} className="float-end">
            Tambah Akun
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
                <th className="p-2 bg-light">Nama Optik</th>
              </tr>
            </thead>
            <tbody>
              {dataAkun
                .filter(function (user) {
                  return user.id != dataUser.id;
                })
                .map((item, index) => (
                  <tr key={index} onClick={() => handleClickRow(item.id)}>
                    <td>{index + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.username}</td>
                    <td>{item.role}</td>
                    <td>{item.nama_optik || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
        <Col md={6} className={showTambah ? "d-block" : "d-none"}>
          <TambahAkun
            closeButton={handleShowTambah}
            getDataAkun={getDataAkun}
            dataOptik={dataOptik}
          />
        </Col>
        <Col md={6} className={showDetail ? "d-block" : "d-none"}>
          <Container>
            <small className="mb-0">Edit Akun</small>
            <hr style={{ margin: 0 }} />
            <Form className="mt-2" onSubmit={handleSubmit} autoComplete="off">
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}>
                  Nama <i className="text-danger">*</i>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    required
                    name="nama"
                    placeholder="Nama"
                    value={akunDetail.nama}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}>
                  Username <i className="text-danger">*</i>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    required
                    name="username"
                    placeholder="Username"
                    value={akunDetail.username}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}>
                  password
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={akunDetail.password}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}>
                  Role <i className="text-danger">*</i>
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    aria-label="Default select example"
                    name="role"
                    value={akunDetail.role}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-2">
                <Form.Label column sm={3}>
                  Nama Optik
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    aria-label="Default select example"
                    name="id_optik"
                    value={akunDetail.id_optik}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  >
                    <option value="" disabled>
                      -- Nama Optik --
                    </option>
                    {dataOptik.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.nama_optik}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>
              <div className="d-flex justify-content-between">
                <div>
                  <Button
                    variant="danger"
                    className="my-2"
                    onClick={() => handleClickHapus(akunDetail.id)}
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
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default PengaturanAkun;
