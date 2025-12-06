import React, { useEffect, useState } from "react";
import "./VideoModal.css";

const VideoModal = ({ isOpen, onClose, onSave, videoToEdit }) => {
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");

  // Cargar datos si es edición
  useEffect(() => {
    if (videoToEdit) {
      setTitulo(videoToEdit.titulo || "");
      setUrl(videoToEdit.url || "");
    } else {
      setTitulo("");
      setUrl("");
    }
  }, [videoToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !url) {
      alert("Título y URL son obligatorios");
      return;
    }
    // Llama a la función pasada desde Player
    onSave({ titulo, url });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{videoToEdit ? "Editar video" : "Agregar video"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </label>

          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </label>

          <div className="modal-buttons">
            <button type="submit" className="btn-save">
              {videoToEdit ? "Actualizar" : "Guardar"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoModal;
