import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { ArrowLeftCircleFill } from "react-bootstrap-icons";

function DetailEceran() {
  const { state } = useLocation();
  const [detail, setDetail] = useState(state.row);
  const navigate = useNavigate();
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (
    <Container className="pt-4 pb-4 title-page">
      <Row className="p-2 text-white bg-primary shadow-sm mx-1">
        <Col className="pt-1">
          <h4 className="mb-0">Detail Eceran</h4>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col md={12}>
          <div>
            <Button variant="default" onClick={() => navigate("/eceran")}>
              <ArrowLeftCircleFill /> Kembali
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <Card className="mt-1">
            <Card.Body>
              <h5 className="text-center mt-1 text-uppercase">{detail.nama}</h5>
              <table className="table table-sm table-detail">
                <tbody>
                  <tr>
                    <td className="fw-semibold">Tanggal</td>
                    <td>:</td>
                    <td>
                      {moment(detail.tanggal)
                        .tz("Asia/Jakarta")
                        .format("DD MMMM YYYY")}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Alamat</td>
                    <td>:</td>
                    <td>{detail.alamat.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">No hp</td>
                    <td>:</td>
                    <td>{detail.nohp || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Frame</td>
                    <td>:</td>
                    <td>{detail.frame.toUpperCase() || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Lensa</td>
                    <td>:</td>
                    <td>{detail.lensa.toUpperCase() || "-"}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Harge</td>
                    <td>:</td>
                    <td>Rp {addCommas(detail.harga)}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mt-1">
            <Card.Body>
              <table className="table table-sm table-bordered table-detail">
                <thead>
                  <tr>
                    <th></th>
                    <th>Sph</th>
                    <th>Cyl</th>
                    <th>Axis</th>
                    <th>Add</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>OD</th>
                    <td>{detail.r.split("/")[0]}</td>
                    <td>{detail.r.split("/")[1]}</td>
                    <td>{detail.r.split("/")[2]}</td>
                    <td>{detail.r.split("/")[3]}</td>
                  </tr>
                  <tr>
                    <th>OS</th>
                    <td>{detail.l.split("/")[0]}</td>
                    <td>{detail.l.split("/")[1]}</td>
                    <td>{detail.l.split("/")[2]}</td>
                    <td>{detail.l.split("/")[3]}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DetailEceran;
