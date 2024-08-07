import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function TambahAkun({ closeButton, getDataAkun, dataOptik }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigation();
  const [dataUser, setDataUser] = useState({
    nama: "",
    username: "",
    password: "",
    role: "user",
    id_optik: "",
  });

  const handleChange = (e) => {
    setDataUser((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({
        nama: dataUser.nama,
        username: dataUser.username,
        password: dataUser.password,
        role: dataUser.role,
        id_optik: dataUser.id_optik,
      });
      const URL = API + "user";
      const response = await axios.post(
        URL,
        {
          nama: dataUser.nama,
          username: dataUser.username,
          password: dataUser.password,
          role: dataUser.role,
          id_optik: dataUser.id_optik,
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
        getDataAkun();
        setDataUser({
          nama: "",
          username: "",
          password: "",
          role: "user",
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
    <Container>
      <Card className="mt-1">
        <Card.Body>
          <small className="mb-0">Tambah Akun</small>
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
                  value={dataUser.nama}
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
                  value={dataUser.username}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column sm={3}>
                password <i className="text-danger">*</i>
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="password"
                  required
                  name="password"
                  placeholder="Password"
                  value={dataUser.password}
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
                  value={dataUser.role}
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
                  value={dataUser.id_optik}
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
            <Button type="submit" className="float-end mt-2">
              Simpan
            </Button>
            <Button
              variant="default"
              className="float-end border me-2 my-2"
              onClick={closeButton}
            >
              Batal
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TambahAkun;
