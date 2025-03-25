// frontend/src/views/Register.jsx
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataDiNascita: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert("Errore nella registrazione: " + (errorData.msg || "Unknown"));
        return;
      }
      const data = await response.json(); // { token: "..." }
      
      // Salva il token
      localStorage.setItem("accessToken", data.token);

      // Recupera i dati dell'utente
      const resMe = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      const meData = await resMe.json(); // { _id: "...", nome: "...", ecc. }
      localStorage.setItem("userId", meData._id);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Errore nella registrazione");
    }
  };

  return (
    <Container>
      <h2>Registrazione</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nome" className="mt-2">
          <Form.Label>Nome</Form.Label>
          <Form.Control 
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="cognome" className="mt-2">
          <Form.Label>Cognome</Form.Label>
          <Form.Control 
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="dataDiNascita" className="mt-2">
          <Form.Label>Data di Nascita</Form.Label>
          <Form.Control 
            type="text"
            name="dataDiNascita"
            placeholder="YYYY-MM-DD (o altro formato)"
            value={formData.dataDiNascita}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Registrati
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
