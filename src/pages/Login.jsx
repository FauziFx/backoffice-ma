import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

function Login() {
  const API = import.meta.env.VITE_API_URL;
  const [isDisabled, setIsDisabled] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [dataLogin, setDataLogin] = useState({
    username: "",
    password: "",
  });

  const handleChange = async (e) => {
    setDataLogin((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      const response = await axios.post(API + "/login", {
        username: dataLogin.username,
        password: dataLogin.password,
      });
      if (response.data.success) {
        const token = response.data.token;
        const decode = jwtDecode(token).user;
        if (decode.role == "admin") {
          localStorage.clear();
          localStorage.setItem("user-token", token);
          const cookies = new Cookies();
          cookies.set("backoffice-ma-token", token, {
            maxAge: 2628000,
          });

          setTimeout(() => {
            window.location.replace("/");
          }, 500);
        } else {
          setMsg("Kamu tidak diizinkan mengakses halaman ini!");
          setIsDisabled(false);
        }
      } else {
        setMsg(response.data.message);
        setIsDisabled(false);
      }
    } catch (error) {
      setIsDisabled(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // const userToken = localStorage.getItem("user-token");
    const cookies = new Cookies();
    const userToken = cookies.get("backoffice-ma-token");
    if (userToken) {
      return navigate("/");
    }
  }, []);

  return (
    <section className="h-100 title-page">
      <Container className="h-100">
        <Row className="justify-content-sm-center h-100">
          <Col sm={9} md={7} lg={5} xl={5} xxl={4}>
            <div className="text-center my-5">
              <h1>Backoffice MA</h1>
            </div>
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                {msg && (
                  <Alert
                    variant="danger"
                    onClose={() => setMsg("")}
                    dismissible
                  >
                    {msg}
                  </Alert>
                )}
                <h1 className="fs-4 card-title fw-bold mb-4">Login</h1>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="username">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="form-control"
                      name="username"
                      required
                      autoFocus
                      placeholder="Username"
                      value={dataLogin.username}
                      onChange={(e) => handleChange(e)}
                    />
                    <div className="invalid-feedback">Email is invalid</div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 w-100">
                      <label className="text-muted" htmlFor="password">
                        Password
                      </label>
                    </div>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      placeholder="******"
                      value={dataLogin.password}
                      onChange={(e) => handleChange(e)}
                    />
                    <div className="invalid-feedback">Password is required</div>
                  </div>

                  <div className="d-flex align-items-center">
                    <button
                      type="submit"
                      className="btn btn-primary ms-auto"
                      disabled={!dataLogin.username || !dataLogin.password}
                    >
                      Login
                    </button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <div className="text-center mt-5 text-muted">
              &copy; Copyright 2024 Backoffice MA
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Login;
