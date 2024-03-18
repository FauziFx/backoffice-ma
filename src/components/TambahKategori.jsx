import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function TambahKategori({ closeButton, getDataKategori }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigation();
  const [dataKategori, setDataKategori] = useState({
    nama_kategori: "",
  });

  const handleChange = (e) => {
    setDataKategori({
      nama_kategori: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = API + "kategori";
      const response = await axios.post(
        URL,
        {
          nama_kategori: dataKategori.nama_kategori,
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
        getDataKategori();
        setDataKategori({
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
              value={dataKategori.nama_kategori}
              onChange={(e) => handleChange(e)}
              required
              placeholder="Nama Kategori"
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
    </Container>
  );
}

export default TambahKategori;
