import React, { useState } from "react";
import { Container, Card, Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Profil({ dataUser }) {
  const API = import.meta.env.VITE_API_URL;
  const [showEdit, setShowEdit] = useState(false);
  const [msgPassLama, setMsgPassLama] = useState("");
  const [msgPassBaru, setMsgPassBaru] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nama: "",
    username: "",
    password_lama: "",
    password_baru: "",
    konfirmasi_password_baru: "",
  });

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

  const handleChange = (e) => {
    setUser((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMsgPassBaru("");
      setMsgPassLama("");
      if (user.password_baru != user.konfirmasi_password_baru) {
        setMsgPassBaru("1");
      } else {
        const id = dataUser.id;
        const URL = API + "change_password/" + id;
        const response = await axios.put(
          URL,
          {
            nama: user.nama,
            username: user.username,
            password_lama: user.password_lama,
            password_baru: user.password_baru,
            role: dataUser.role,
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
          if (response.data.match === true) {
            setUser((prev) => {
              return {
                ...prev,
                password_lama: "",
                password_baru: "",
                konfirmasi_password_baru: "",
              };
            });
            Toast.fire({
              icon: "success",
              title: "Data berhasil disimpan!",
            });
          } else {
            setMsgPassLama("1");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <h3>Profil</h3>
        </Col>
      </Row>
      <Row>
        <Card>
          <Card.Body>
            <Row>
              <Col md={7} className={showEdit ? "d-none" : "d-block"}>
                <table className="table">
                  <tbody>
                    <tr>
                      <td className="text-start">Nama</td>
                      <td className="text-end">{dataUser.nama}</td>
                    </tr>
                    <tr>
                      <td className="text-start">Username/Email</td>
                      <td className="text-end">{dataUser.username}</td>
                    </tr>
                    <tr>
                      <td className="text-start">Role</td>
                      <td className="text-end text-capitalize">
                        {dataUser.role}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Button
                  variant="link"
                  onClick={() => {
                    setUser((prev) => {
                      return {
                        ...prev,
                        nama: dataUser.nama,
                        username: dataUser.username,
                      };
                    });
                    setShowEdit(true);
                  }}
                >
                  Edit Profil
                </Button>
              </Col>
              <Col md={7} className={showEdit ? "d-block" : "d-none"}>
                <Form
                  className="mt-2"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={4}>
                      Nama <i className="text-danger">*</i>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        required
                        name="nama"
                        placeholder="Nama"
                        autoComplete="off"
                        value={user.nama}
                        onChange={(e) => handleChange(e)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={4}>
                      Username/Email <i className="text-danger">*</i>
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        required
                        name="username"
                        placeholder="Username"
                        autoComplete="off"
                        value={user.username}
                        onChange={(e) => handleChange(e)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={4}>
                      Password Lama
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="password"
                        name="password_lama"
                        placeholder="Password Lama"
                        autoComplete="off"
                        required
                        value={user.password_lama}
                        onChange={(e) => handleChange(e)}
                      />
                      {msgPassLama && (
                        <small className="text-danger">
                          * Password Lama salah
                        </small>
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={4}>
                      Password Baru
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="password"
                        name="password_baru"
                        placeholder="Password Baru"
                        autoComplete="off"
                        required
                        value={user.password_baru}
                        onChange={(e) => handleChange(e)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-2">
                    <Form.Label column sm={4}>
                      Konfirmasi Password Baru
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="password"
                        name="konfirmasi_password_baru"
                        placeholder="Konfirmasi Password Baru"
                        autoComplete="off"
                        required
                        value={user.konfirmasi_password_baru}
                        onChange={(e) => handleChange(e)}
                      />
                      {msgPassBaru && (
                        <small className="text-danger">
                          * Password tidak sama dengan password baru
                        </small>
                      )}
                    </Col>
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="default"
                      type="button"
                      className="float-end mt-2 border"
                      onClick={() => setShowEdit(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="float-end mt-2">
                      Simpan
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}
