import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Card,
  Modal,
  FormControl,
} from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay-ts";
import PulseLoader from "react-spinners/PulseLoader";
import { Search } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleRight,
  faBarcode,
  faCircleXmark,
  faCircleCheck,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import Barcode from "react-barcode";
import ComponentToPrintBarcode from "../components/ComponentToPrintBarcode";
import ReactToPrint, { useReactToPrint } from "react-to-print";

function CetakBarcode() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [dataProduk, setDataProduk] = useState([]);
  const [dataProdukFilter, setDataProdukFilter] = useState([]);
  const [dataKategori, setDataKategori] = useState([]);
  const [selectKategori, setSelectKategori] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [loadingDataVarian, setLoadingDataVarian] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dataVarian, setDataVarian] = useState([]);
  const [totalSelected, setTotalSelected] = useState(0);
  const [dataSelected, setDataSelected] = useState([]);
  const [step2, setStep2] = useState(false);

  // Print Document
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const columns = [
    {
      name: "Nama Produk",
      selector: (row) => row.nama_produk,
      sortable: true,
    },
    {
      name: "Kategori",
      selector: (row) => row.nama_kategori,
      sortable: true,
    },
    {
      name: "Stok",
      selector: (row) => row.stok,
      sortable: true,
    },
  ];

  const columnsVarian = [
    {
      name: "Kode",
      selector: (row) => (
        <Barcode value={row.kode} height={18} width={1} fontSize={11} />
      ),
      sortable: true,
    },
    {
      name: "Nama Produk",
      selector: (row) => row.nama,
      sortable: true,
    },
    {
      name: "Varian",
      selector: (row) => row.nama_varian,
      sortable: true,
    },
  ];

  const getDataProduk = async () => {
    try {
      const URL = API + "produk";
      const response = await axios.get(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setDataProduk(response.data.data);
        setDataProdukFilter(response.data.data);
        setLoadingData(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataKategori = async () => {
    try {
      const URL = API + "kategori";
      const response = await axios.get(URL, {
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

  const getDataVarian = async (id_produk) => {
    try {
      const URL = API + "produk/" + id_produk;
      const response = await axios.get(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        const data = response.data.data;

        setDataVarian(data.varian);
        setLoadingDataVarian(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickRow = (id) => {
    getDataVarian(id);
    setShowModal(true);
  };

  const handleChangeSelectItem = ({ selectedRows }) => {
    setTotalSelected(selectedRows.length);
    setDataSelected(selectedRows);
  };

  const handleDataPrint = () => {
    setStep2(true);
  };

  useEffect(() => {
    getDataProduk();
    getDataKategori();
  }, []);

  useEffect(() => {
    let filterSearch = dataProduk.filter((item) => {
      return item.nama_produk
        .toLowerCase()
        .includes(searchInput.toLocaleLowerCase());
    });
    let filterKategori = filterSearch.filter((item) => {
      return item.nama_kategori
        .toLowerCase()
        .includes(selectKategori.toLocaleLowerCase());
    });

    setDataProdukFilter(filterKategori);
  }, [searchInput, selectKategori]);

  return (
    <Container className="pt-4 title-page">
      <Row className="p-2 text-white bg-primary shadow-sm mx-1">
        <Col className="pt-1">
          <h4 className="mb-0">
            Cetak Barcode <FontAwesomeIcon icon={faBarcode} />
          </h4>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Row>
            <Col md={6} className="mt-1">
              <Form.Select
                aria-label="Default select example"
                value={selectKategori}
                onChange={(e) => setSelectKategori(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                <option value="0">Uncategorized</option>
                {dataKategori.map((item, index) => (
                  <option key={index} value={item.nama_kategori}>
                    {item.nama_kategori}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} className="mt-1">
              <InputGroup>
                <Form.Control
                  type="text"
                  id="search-data"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari..."
                />
                <InputGroup.Text id="basic-addon2">
                  <Search />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Card className="mt-1 mb-4">
            <Card.Body>
              <LoadingOverlay active={loadingData} spinner={<PulseLoader />}>
                {/* DataTables */}
                <DataTable
                  className="mw-100"
                  columns={columns}
                  data={dataProdukFilter}
                  highlightOnHover
                  pagination
                  customStyles={tableCustomStyles}
                  onRowClicked={(row) => handleClickRow(row.id)}
                />
              </LoadingOverlay>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Cetak Barcode */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        aria-labelledby="modal-cetak-barcode"
        backdrop="static"
        keyboard={false}
        className="modal-full"
      >
        <Modal.Header className="py-2">
          <h5 className="mb-0">Cetak Barcode</h5>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Navigation */}
            <Col md={2} className="pe-0">
              <Button
                variant="outline-primary"
                className="active text-start w-75 mb-2"
              >
                1. Pilih Item
              </Button>
              {totalSelected > 0 ? (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="text-success ms-2"
                  size="2x"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="text-danger ms-2"
                  size="2x"
                />
              )}
              <Button
                variant="outline-primary"
                className={
                  step2
                    ? "text-start w-75 mb-2 active"
                    : "text-start w-75 mb-2 disabled"
                }
              >
                2. Cetak Barcode
              </Button>
              {step2 && (
                <>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-success ms-2"
                    size="2x"
                  />
                  <br />
                  <div style={{ fontSize: "12px" }}>
                    <span className="fw-bold">Ukuran Kertas :</span>
                    <div>A4</div>
                    <span className="fw-bold">Barcode per item :</span>
                    <div>
                      <FormControl
                        readOnly
                        type="number"
                        value="1"
                        onFocus={(e) =>
                          e.target.addEventListener(
                            "wheel",
                            function (e) {
                              e.preventDefault();
                            },
                            { passive: false }
                          )
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </Col>
            {/* Content */}
            {!step2 ? (
              <Col md={10}>
                <div className="d-flex justify-content-between">
                  <div>
                    <Button
                      variant="danger"
                      onClick={() => setShowModal(false)}
                      size="sm"
                    >
                      Batal
                    </Button>
                  </div>
                  <div>{totalSelected}&nbsp;Item</div>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={totalSelected == 0}
                      onClick={() => handleDataPrint()}
                    >
                      Selanjutnya{" "}
                      <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </Button>
                  </div>
                </div>
                <div
                  className="overflow-y-scroll mt-2"
                  style={{ height: "550px" }}
                >
                  <LoadingOverlay
                    active={loadingDataVarian}
                    spinner={<PulseLoader />}
                  >
                    {/* DataTables */}
                    <DataTable
                      className="mw-100"
                      columns={columnsVarian}
                      data={dataVarian}
                      highlightOnHover
                      selectableRows
                      onSelectedRowsChange={handleChangeSelectItem}
                      customStyles={tableCustomStyles}
                    />
                  </LoadingOverlay>
                </div>
              </Col>
            ) : (
              <Col md={10} className="ps-0">
                <div className="d-flex justify-content-between">
                  <div>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setStep2(false);
                        setDataSelected([]);
                        setTotalSelected(0);
                      }}
                      size="sm"
                    >
                      Kembali
                    </Button>
                  </div>
                  <div>{totalSelected}&nbsp;Item</div>
                  <div>
                    <ReactToPrint
                      trigger={() => (
                        <Button variant="primary" size="sm">
                          Cetak <FontAwesomeIcon icon={faPrint} />
                        </Button>
                      )}
                      content={() => componentRef.current}
                    />
                  </div>
                </div>
                <div
                  className="overflow-y-scroll bg-dark mt-2"
                  style={{ height: "550px" }}
                >
                  <ComponentToPrintBarcode
                    ref={componentRef}
                    dataPrint={dataSelected}
                  />
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

const tableCustomStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      backgroundColor: "#ebebeb",
    },
  },
  rows: {
    style: {
      minHeight: "40px", // override the row height
    },
  },
};

export default CetakBarcode;
