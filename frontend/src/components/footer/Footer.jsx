// frontend/src/components/footer/Footer.jsx
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={{ paddingTop: 50, paddingBottom: 50 }}>
      <Container>
        {new Date().getFullYear()} - © Strive Blog | Developed for homework projects.
      </Container>
    </footer>
  );
};

export default Footer;
