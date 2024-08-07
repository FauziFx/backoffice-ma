import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Table,
  Card,
} from "react-bootstrap";
import { Search, Trash3Fill } from "react-bootstrap-icons";
import TambahKategori from "../components/TambahKategori";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Kategori() {
  const [showTambah, setShowTambah] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataKategori, setDataKategori] = useState([]);
  const [kategoriDetail, setKategoriDetail] = useState({
    id: "",
    nama_kategori: "",
  });
  const [searchInput, setSearchInput] = useState("");

  const handleShowTambah = () => {
    setShowTambah(!showTambah);
    setShowDetail(false);
  };

  const getDataKategori = async (search) => {
    try {
      const URL = API + "kategori";
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
        setDataKategori(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getKategoriDetail = async (id_kategori) => {
    try {
      const URL = API + "kategori/" + id_kategori;
      const response = await axios.get(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setKategoriDetail({
          id: response.data.data.id,
          nama_kategori: response.data.data.nama_kategori,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeSearch = (e) => {
    const search = e.target.value;
    setSearchInput(search);
    getDataKategori(search);
  };

  const handleChange = (e) => {
    setKategoriDetail((prevState) => ({
      ...prevState,
      nama_kategori: e.target.value,
    }));
  };

  const handleClickRow = (id_kategori) => {
    getKategoriDetail(id_kategori);
    setShowDetail(true);
    setShowTambah(false);
  };

  const handleClickHapus = (id_kategori) => {
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
        deleteKategori(id_kategori);
      }
    });
  };

  const deleteKategori = async (id_kategori) => {
    try {
      const URL = API + "kategori/" + id_kategori;
      const response = await axios.delete(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        getDataKategori();
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
      const URL = API + "kategori/" + kategoriDetail.id;
      const response = await axios.put(
        URL,
        {
          nama_kategori: kategoriDetail.nama_kategori,
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
        getDataKategori();
        setShowDetail(false);
        setKategoriDetail({
          id: "",
          nama_kategori: "",
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
          <h4 className="mb-0">Kategori</h4>
        </Col>
        <Col className=" d-none d-sm-none d-md-block">
          <Button onClick={() => handleShowTambah()} className="float-end">
            Tambah Kategori
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
              <Table hover size="md" responsive className="mt-2 table-fixed">
                <thead>
                  <tr>
                    <th className="p-2 bg-light col-6">Nama Kategori</th>
                    <th className="p-2 bg-light col-6">Produk</th>
                  </tr>
                </thead>
                <tbody>
                  {dataKategori.map((item, index) => (
                    <tr key={index} onClick={() => handleClickRow(item.id)}>
                      <td className="col-6">{item.nama_kategori}</td>
                      <td className="col-6">{item.produk} Item</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className={showTambah ? "d-block" : "d-none"}>
          <TambahKategori
            closeButton={handleShowTambah}
            getDataKategori={getDataKategori}
          />
        </Col>
        <Col md={6} className={showDetail ? "d-block" : "d-none"}>
          <Container>
            <Card className="mt-1">
              <Card.Body>
                <small className="mb-0">Kategori</small>
                <hr style={{ margin: 0 }} />
                <Form className="mt-2" onSubmit={handleSubmit}>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={3}>
                      Nama Kategori <i className="text-danger">*</i>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        value={kategoriDetail.nama_kategori}
                        onChange={(e) => handleChange(e)}
                        required
                        placeholder="Nama Kategori"
                      />
                    </Col>
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Button
                        variant="danger"
                        className="my-2"
                        onClick={() => handleClickHapus(kategoriDetail.id)}
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

export default Kategori;
