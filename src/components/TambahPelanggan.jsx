import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function TambahPelanggan({ closeButton, getDataPelanggan }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigation();
  const [dataPelanggan, setDataPelanggan] = useState({
    nama_pelanggan: "",
    nohp: "",
  });

  const handleChange = (e) => {
    setDataPelanggan((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = API + "pelanggan";
      const response = await axios.post(
        URL,
        {
          nama_pelanggan: dataPelanggan.nama_pelanggan,
          nohp: dataPelanggan.nohp,
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
        getDataPelanggan();
        setDataPelanggan({
          nama_pelanggan: "",
          nohp: "",
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
                  name="nama_pelanggan"
                  placeholder="Nama Pelanggan"
                  value={dataPelanggan.nama_pelanggan}
                  onChange={(e) => handleChange(e)}
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
                  name="nohp"
                  placeholder="No Hp"
                  value={dataPelanggan.nohp}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
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

export default TambahPelanggan;
