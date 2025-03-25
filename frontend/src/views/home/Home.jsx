// frontend/src/views/home/Home.jsx
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogPosts");
      if (!res.ok) throw new Error("Errore nel recupero dei post");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      <h1>Benvenuto su Strive Blog</h1>
      <p>Qui potrai trovare i migliori articoli!</p>
      <Row>
        {posts.map((post) => (
          <Col md={4} key={post._id} className="mb-4">
            <Link to={`/blog/${post._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card>
                {post.cover && <Card.Img variant="top" src={post.cover} />}
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>
                    <strong>Autore:</strong> {post.author?.nome} {post.author?.cognome} <br />
                    <strong>Tempo di lettura:</strong> {post.readTime?.value} {post.readTime?.unit}
                  </Card.Text>
                  <Card.Text>{post.content.slice(0, 80)}...</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
