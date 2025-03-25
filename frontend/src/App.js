// frontend/src/App.js
import { Routes, Route } from 'react-router-dom';
import Home from './views/home/Home';
import Blog from './views/blog/Blog';
import NewBlogPost from './views/new/NewBlogPost';
import Login from './views/Login';
import Register from './views/Register';
import GoogleSuccess from './views/GoogleSuccess';
import BlogNavBar from './components/navbar/BlogNavbar';
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <BlogNavBar />
      <div className="container mt-5 pt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/new" element={<NewBlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google/success" element={<GoogleSuccess />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
