// frontend/src/components/GoogleLoginButton.jsx
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button onClick={handleGoogleLogin} className="btn btn-danger">
      Login con Google
    </button>
  );
};

export default GoogleLoginButton;
