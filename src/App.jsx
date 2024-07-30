import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import DataProduk from "./pages/DataProduk";
import Error404 from "./pages/Error404";
import Kategori from "./pages/Kategori";
import PenyesuaianStok from "./pages/PenyesuaianStok";
import LaporanPenjualan from "./pages/LaporanPenjualan";
import LaporanTransaksi from "./pages/LaporanTransaksi";
import Pelanggan from "./pages/Pelanggan";
import PengaturanAkun from "./pages/PengaturanAkun";
import PengaturanNota from "./pages/PengaturanNota";
import Profil from "./components/Profil";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Eceran from "./pages/Eceran";
import TambahEceran from "./pages/TambahEceran";
import EditEceran from "./pages/EditEceran";
import DetailEceran from "./pages/DetailEceran";

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const cookies = new Cookies();
    const userToken = cookies.get("backoffice-ma-token");
    if (userToken) {
      const decode = jwtDecode(userToken).user;
      setUser(decode);
      localStorage.setItem("backoffice-ma-token", userToken);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: (
        <>
          <ProtectedRoutes />
        </>
      ),
      children: [
        {
          element: <Navigation dataUser={user} />,
          children: [
            {
              path: "/",
              element: <Dashboard />,
            },
            {
              path: "/eceran",
              element: <Eceran />,
            },
            {
              path: "/eceran/tambah",
              element: <TambahEceran />,
            },
            {
              path: "/eceran/edit",
              element: <EditEceran />,
            },
            {
              path: "/eceran/detail",
              element: <DetailEceran />,
            },
            {
              path: "/produk/data-produk",
              element: <DataProduk />,
            },
            {
              path: "/produk/kategori",
              element: <Kategori />,
            },
            {
              path: "/produk/penyesuaian-stok",
              element: <PenyesuaianStok />,
            },
            {
              path: "/laporan/penjualan",
              element: <LaporanPenjualan />,
            },
            {
              path: "/laporan/transaksi",
              element: <LaporanTransaksi />,
            },
            {
              path: "/pelanggan",
              element: <Pelanggan />,
            },
            {
              path: "/pengaturan/akun",
              element: <PengaturanAkun dataUser={user} />,
            },
            {
              path: "/pengaturan/nota",
              element: <PengaturanNota />,
            },
            {
              path: "/profil/:nama",
              element: <Profil dataUser={user} />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
