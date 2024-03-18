import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

function TambahPelanggan({ closeButton }) {
  return (
    <Container>
      <small className="mb-0">Informasi</small>
      <hr style={{ margin: 0 }} />
      <Form className="mt-2">
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm={3}>
            Nama Pelanggan <i className="text-danger">*</i>
          </Form.Label>
          <Col sm={9}>
            <Form.Control type="text" placeholder="Nama Pelanggan" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm={3}>
            No Hp
          </Form.Label>
          <Col sm={9}>
            <Form.Control type="text" placeholder="No Hp" />
          </Col>
        </Form.Group>
        <Button className="float-end mt-2">Simpan</Button>
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

export default TambahPelanggan;
