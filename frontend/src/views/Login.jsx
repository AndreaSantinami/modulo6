// frontend/src/views/Login.jsx
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        alert("Credenziali non valide");
        return;
      }
      const data = await response.json(); // { token: "..."}
      
      // Salva il token
      localStorage.setItem("accessToken", data.token);

      // Recupera i dati dell'utente loggato (per avere _id)
      const resMe = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      const meData = await resMe.json(); // { _id: "...", nome: "...", ecc. }
      localStorage.setItem("userId", meData._id);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Errore nel login");
    }
  };

  return (
    <Container>
      <h2>Login Manuale</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Inserisci email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>

      <hr />
      <GoogleLoginButton />
    </Container>
  );
};

export default Login;
