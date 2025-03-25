// frontend/src/views/GoogleSuccess.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      // Salviamo il token in localStorage
      localStorage.setItem("accessToken", token);

      // Recuperiamo i dati dell'utente (inclusi nome e cognome)
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((meData) => {
          // Salviamo userId e userName
          localStorage.setItem("userId", meData._id);
          localStorage.setItem("userName", meData.nome + " " + meData.cognome);
          // Reindirizziamo alla homepage
          navigate("/");
        })
        .catch((err) => {
          console.error("Errore nel recupero /me:", err);
          // In caso di errore, torniamo comunque alla homepage
          navigate("/");
        });
    } else {
      // Se manca il token, andiamo direttamente alla homepage
      navigate("/");
    }
  }, [location, navigate]);

  return null;
};

export default GoogleSuccess;
