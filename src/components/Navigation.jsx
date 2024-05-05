import { Dropdown } from "bootstrap";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

function Navigation({ dataUser }) {
  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="">Backoffice MA</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" type="button" className="nav-link">
                Dashboard
              </Link>
              <NavDropdown title="Produk" id="basic-nav-dropdown">
                <Link to="produk/data-produk" className="dropdown-item">
                  Data Produk
                </Link>
                <Link to="produk/kategori" className="dropdown-item">
                  Kategori
                </Link>
                <Link to="produk/penyesuaian-stok" className="dropdown-item">
                  Penyesuaian Stok
                </Link>
              </NavDropdown>
              <NavDropdown title="Laporan" id="basic-nav-dropdown">
                <Link to="laporan/penjualan" className="dropdown-item">
                  Penjualan
                </Link>
                <Link to="laporan/transaksi" className="dropdown-item">
                  Transaksi
                </Link>
              </NavDropdown>
              <Link to="/pelanggan" type="button" className="nav-link">
                Pelanggan
              </Link>
              <NavDropdown title="Pengaturan" id="basic-nav-dropdown">
                <Link to="pengaturan/akun" className="dropdown-item">
                  Akun
                </Link>
                <Link to="pengaturan/nota" className="dropdown-item">
                  Nota
                </Link>
              </NavDropdown>
            </Nav>

            <Nav className="ms-auto">
              <NavDropdown title={dataUser.nama} id="basic-nav-dropdown">
                <Link to={"/profil/" + dataUser.nama} className="dropdown-item">
                  {dataUser.username}
                </Link>
                <Link
                  className="dropdown-item"
                  onClick={() => {
                    const cookie = new Cookies();
                    cookie.remove("backoffice-ma-token", { path: "/" });
                    localStorage.clear();
                    setTimeout(() => {
                      window.location.replace("/");
                    }, 500);
                  }}
                >
                  Logout
                </Link>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default Navigation;
