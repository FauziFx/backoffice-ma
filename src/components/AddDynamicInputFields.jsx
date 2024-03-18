import { useState } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";

export default function AddDynamicInputFields() {
  const [showTracking, setShowTracking] = useState(false);

  const handleClose = () => setShowTracking(false);
  const handleShow = () => setShowTracking(true);

  const [varianInputs, setVarianInputs] = useState([
    { nama_varian: "", stok: 0, stok_min: 0, harga: "", track_stok: "y" },
  ]);

  const handleAddInput = () => {
    setVarianInputs([
      ...varianInputs,
      { nama_varian: "", stok: 0, stok_min: 0, harga: "", track_stok: "y" },
    ]);
  };

  const handleChange = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...varianInputs];
    onChangeValue[index][name] = value;
    setVarianInputs(onChangeValue);
  };

  const handleDeleteInput = (index) => {
    const newArray = [...varianInputs];
    newArray.splice(index, 1);
    setVarianInputs(newArray);
  };

  const handleChangeCheck = (e, id) => {
    const { value, checked } = e.target;

    const newList = varianInputs.map((obj, index) => {
      // 👇️ if id equals 2, update country property

      if (index === id) {
        if (checked) {
          return { ...obj, track_stok: "y" };
        } else {
          return { ...obj, track_stok: "n" };
        }
      }
      // 👇️ otherwise return the object as is
      return obj;
    });
    setVarianInputs(newList);
  };

  return (
    <>
      <Button
        size="sm"
        className="mt-2 rounded-0"
        onClick={() => handleAddInput()}
      >
        Tambah Varian
      </Button>
      <Button
        size="sm"
        variant="success"
        className="mt-2 ms-2 rounded-0"
        onClick={() => handleShow()}
      >
        Track Stok
      </Button>
      <Row className="mt-2 fw-semibold">
        <Col sm={5}>Nama Varian</Col>
        <Col sm={3}>Harga</Col>
      </Row>
      <div className="overflow-y-auto pt-3 pb-3" style={{ height: "400px" }}>
        {varianInputs.map((item, index) => (
          <Row key={index}>
            <Col sm={5} className="pe-0">
              <Form.Control
                className="rounded-0"
                name="nama_varian"
                type="text"
                value={item.nama_varian}
                onChange={(event) => handleChange(event, index)}
                placeholder="Nama Varian"
              />
            </Col>
            <Col sm={3} className="px-0">
              <Form.Control
                className="rounded-0"
                name="harga"
                type="number"
                value={item.harga}
                onChange={(event) => handleChange(event, index)}
                placeholder="Harga"
              />
            </Col>
            <Col sm={1} className="ps-0">
              {varianInputs.length > 1 && (
                <Button
                  size="sm"
                  variant="light"
                  className="text-danger"
                  onClick={() => handleDeleteInput(index)}
                >
                  <XCircleFill />
                </Button>
              )}
            </Col>
          </Row>
        ))}
      </div>

      {/* <div className="body"> {JSON.stringify(varianInputs)} </div> */}

      <Modal show={showTracking} onHide={handleClose} scrollable>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-light">Tracking Stok</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-1">
          <Row className="fw-semibold mb-1 bg-grey py-2">
            <Col sm={6}>Nama Varian</Col>
            <Col sm={2}>Stok</Col>
            <Col sm={2}>Alert</Col>
            <Col sm={2}>Track</Col>
          </Row>
          {varianInputs.map((item, index) => (
            <Row
              key={index}
              style={{ borderBottom: "solid 1px #d6d9dc" }}
              className="pb-1 mb-1"
            >
              <Col sm={6} className="pe-0 pt-2">
                <p className="mb-0">{item.nama_varian}</p>
              </Col>
              <Col sm={2} className="px-0">
                <Form.Control
                  className="rounded-0"
                  name="stok"
                  type="number"
                  value={item.stok}
                  onChange={(event) => handleChange(event, index)}
                  placeholder=""
                />
              </Col>
              <Col sm={2} className="px-0">
                <Form.Control
                  className="rounded-0"
                  name="stok_min"
                  type="number"
                  value={item.stok_min}
                  onChange={(event) => handleChange(event, index)}
                />
              </Col>
              <Col sm={2} className="pt-2 ps-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="languages"
                  checked={item.track_stok === "y" ? true : false}
                  value="Javascript"
                  id="flexCheckDefault"
                  onChange={(event) => handleChangeCheck(event, index)}
                />
              </Col>
            </Row>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleClose()}>Konfirmasi</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
