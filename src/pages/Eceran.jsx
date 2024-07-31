import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Search, PencilSquare, Trash3Fill } from "react-bootstrap-icons";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";
import PulseLoader from "react-spinners/PulseLoader";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import DataTable from "react-data-table-component";

function Eceran() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const columns = [
    {
      name: "Tanggal",
      selector: (row) => moment(row.tanggal).format("DD/MM/YYYY"),
      sortable: true,
      left: true,
      width: "fit-content",
    },
    {
      name: "No Nota",
      selector: (row) => row.no_nota,
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
    },
    {
      name: "Frame",
      selector: (row) => row.frame.toUpperCase(),
      sortable: true,
    },
    {
      name: "Lensa",
      selector: (row) => row.lensa.toUpperCase(),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Button
            variant="link"
            className="p-2 me-1 text-success"
            onClick={() => navigate("/eceran/edit", { state: { row } })}
          >
            <PencilSquare />
          </Button>
          <Button
            variant="link"
            className="p-2 text-danger"
            onClick={() => confirmDelete(row.id)}
          >
            <Trash3Fill />
          </Button>
        </>
      ),
      width: "fit-content",
      right: true,
    },
  ];

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Hapus data eceran?",
      showDenyButton: true,
      denyButtonText: "Batal",
      confirmButtonText: "Hapus",
      confirmButtonColor: "#dc3741",
      denyButtonColor: "#0d6efd",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEceran(id);
      }
    });
  };

  const deleteEceran = async (id) => {
    try {
      const URL = API + "eceran/" + id;
      const response = await axios.delete(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        getData();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const URL = API + "eceran";
      const response = await axios.get(URL, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.message == "invalid token") {
        localStorage.clear();
        return navigate("/login");
      } else {
        setData(response.data.data);
        setFilter(response.data.data);
        setLoadingData(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let filterSearch = data.filter((item) => {
      return (
        item.nama.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.no_nota.toLowerCase().includes(search.toLocaleLowerCase())
      );
    });
    setFilter(filterSearch);
  }, [search]);

  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <h3>Eceran</h3>
        </Col>
        <Col>
          <span className="float-end">
            <Button onClick={() => navigate("/eceran/tambah")}>Tambah</Button>
          </span>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Row className="mb-2">
            <Col md={6} className="mt-1">
              <InputGroup>
                <Form.Control
                  type="text"
                  id="search-data"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari No Nota / Nama..."
                />
                <InputGroup.Text id="basic-addon2">
                  <Search />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <LoadingOverlay active={loadingData} spinner={<PulseLoader />}>
            <DataTable
              className="mw-100"
              columns={columns}
              data={filter}
              pagination
              highlightOnHover
              paginationPerPage={20}
              onRowClicked={(row) =>
                navigate("/eceran/detail", { state: { row } })
              }
              customStyles={tableCustomStyles}
            />
          </LoadingOverlay>
        </Col>
      </Row>
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

export default Eceran;
