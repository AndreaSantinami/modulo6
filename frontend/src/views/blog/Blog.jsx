// frontend/src/views/blog/Blog.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Componente per il singolo commento
function CommentItem({ comment, userId, onEdit, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const [tempText, setTempText] = useState(comment.text);

  // Se l'utente loggato è l'autore del commento
  const canEdit = comment.authorId === userId;

  const handleSave = () => {
    onEdit(comment._id, tempText);
    setEditMode(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
      {!editMode ? (
        <>
          <p>
            <strong>{comment.authorName}:</strong> {comment.text}
          </p>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
          {canEdit && (
            <div className="mt-2">
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-sm btn-warning me-2"
              >
                Modifica
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="btn btn-sm btn-danger"
              >
                Elimina
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <textarea
            rows={2}
            className="form-control"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
          />
          <button onClick={handleSave} className="btn btn-sm btn-success mt-2">
            Salva
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setTempText(comment.text);
            }}
            className="btn btn-sm btn-secondary mt-2 ms-2"
          >
            Annulla
          </button>
        </>
      )}
    </div>
  );
}

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Stato del post e caricamento
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // userId, token e userName salvati in localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");

  // Stato per aggiungere un nuovo commento
  const [newComment, setNewComment] = useState("");

  // Stato per la modifica del post
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ title: "", content: "" });

  // 1° useEffect: fa la fetch del post
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogPosts/${id}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  // 2° useEffect: inizializza editData in base al post
  useEffect(() => {
    if (post) {
      setEditData({
        title: post.title || "",
        content: post.content || ""
      });
    }
  }, [post]);

  // Solo adesso controlliamo se stiamo caricando o se manca il post
  if (loading) return <div>Caricamento...</div>;
  if (!post) return <div>Post non trovato</div>;

  // Se l'utente loggato è l'autore del post
  const isAuthor = post.author?._id === userId;

  // Cancella il post (solo se autore)
  const handleDeletePost = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.log("Errore server:", await res.text());
        throw new Error("Errore nella cancellazione del post");
      }
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Ricarica il post (per aggiornare i commenti o i dati dopo la modifica)
  const reloadPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}`);
      if (!res.ok) throw new Error("Post not found");
      const data = await res.json();
      setPost(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Modifica post
  const handleEditPost = () => {
    setEditMode(true);
  };

  const handleSavePost = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editData.title,
          content: editData.content
        }),
      });
      if (!res.ok) {
        console.log("Errore server:", await res.text());
        throw new Error("Errore modifica post");
      }
      setEditMode(false);
      await reloadPost(); // Ricarichiamo i dati del post
    } catch (error) {
      console.error(error);
    }
  };

  // Aggiungi commento
  const handleAddComment = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newComment,
          authorName: userName || "Anonimo",
        }),
      });
      if (!res.ok) {
        console.log("Errore server:", await res.text());
        throw new Error("Errore aggiunta commento");
      }
      setNewComment("");
      await reloadPost();
    } catch (error) {
      console.error(error);
    }
  };

  // Modifica commento
  const handleEditComment = async (commentId, newText) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newText }),
      });
      if (!res.ok) {
        console.log("Errore server:", await res.text());
        throw new Error("Errore modifica commento");
      }
      await reloadPost();
    } catch (error) {
      console.error(error);
    }
  };

  // Cancella commento
  const handleDeleteComment = async (commentId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/blogPosts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.log("Errore server:", await res.text());
        throw new Error("Errore cancellazione commento");
      }
      await reloadPost();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      {/* Se editMode è true, mostriamo un form per modificare il post */}
      {isAuthor && editMode ? (
        <div className="mb-4">
          <h2>Modifica Post</h2>
          <input
            type="text"
            className="form-control mb-2"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            rows={5}
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
          />
          <button onClick={handleSavePost} className="btn btn-success me-2">
            Salva
          </button>
          <button onClick={() => setEditMode(false)} className="btn btn-secondary">
            Annulla
          </button>
        </div>
      ) : (
        // Modalità "view"
        <>
          <h2>{post.title}</h2>
          <p>
            <strong>Autore:</strong> {post.author?.nome} {post.author?.cognome}
          </p>
          <p>{post.content}</p>

          {isAuthor && !editMode && (
            <>
              <button onClick={handleEditPost} className="btn btn-warning">
                Modifica
              </button>
              <button onClick={handleDeletePost} className="btn btn-danger ms-2">
                Cancella
              </button>
            </>
          )}
        </>
      )}

      <hr />
      <h4>Commenti</h4>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            userId={userId}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        ))
      ) : (
        <p>Nessun commento.</p>
      )}

      <div className="mt-3">
        <textarea
          className="form-control"
          rows={2}
          placeholder="Scrivi un commento..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment} className="btn btn-primary mt-2">
          Invia Commento
        </button>
      </div>
    </div>
  );
};

export default Blog;
