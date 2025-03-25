// frontend/src/components/navbar/BlogNavbar.jsx
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../GoogleLoginButton";
import "./styles.css";


const BlogNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={require("../../assets/logo.png")} />
        </Navbar.Brand>

        <div>
          {!token ? (
            <>
              <Button as={Link} to="/register" variant="success" className="me-2">
                Registrati
              </Button>
              <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                Login Manuale
              </Button>
              <GoogleLoginButton />
            </>
          ) : (
            <>
              <Button as={Link} to="/new" variant="dark" className="me-2">
                Nuovo Articolo
              </Button>
              <Button onClick={handleLogout} variant="outline-danger">
                Logout
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default BlogNavbar;
