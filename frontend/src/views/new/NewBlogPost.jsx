// frontend/src/views/new/NewBlogPost.jsx
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NewBlogPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    readTimeValue: "",
    readTimeUnit: "",
    content: "",
  });
  // Stato per il file di copertina
  const [coverFile, setCoverFile] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Gestione dei campi di testo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestione del file selezionato
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

  // Invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Devi essere loggato per creare un articolo");
      return;
    }
    try {
      // Creiamo un FormData e appendiamo tutti i campi + il file
      const dataToSend = new FormData();
      dataToSend.append("category", formData.category);
      dataToSend.append("title", formData.title);
      dataToSend.append("readTimeValue", formData.readTimeValue);
      dataToSend.append("readTimeUnit", formData.readTimeUnit);
      dataToSend.append("content", formData.content);
      if (coverFile) {
        dataToSend.append("cover", coverFile); // "cover" è il nome del campo file
      }

      const response = await fetch("http://localhost:5000/api/blogPosts", {
        method: "POST",
        headers: {
          // Non impostiamo "Content-Type": "application/json" con FormData
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Errore dal server:", result);
        alert("Errore nella creazione del post");
        return;
      }

      console.log("Post creato con successo:", result);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Errore nella creazione del post");
    }
  };

  return (
    <Container>
      <h2>Nuovo Articolo</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mt-2">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Nuovo input di tipo file */}
        <Form.Group className="mt-2">
          <Form.Label>Copertina (immagine)</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Read Time Value</Form.Label>
          <Form.Control
            type="number"
            name="readTimeValue"
            value={formData.readTimeValue}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Read Time Unit</Form.Label>
          <Form.Control
            type="text"
            name="readTimeUnit"
            value={formData.readTimeUnit}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" className="mt-3">
          Pubblica
        </Button>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
