import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function TambahEceran() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <h3>Tambah Eceran</h3>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <div>
            <Button variant="default" onClick={() => navigate("/eceran")}>
              <ArrowLeftCircleFill /> Kembali
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TambahEceran;
