import React, { useEffect, useState } from "react";
import "./ContenidoModal.css";

const ContenidoModal = ({ isOpen, onClose, onSave, contentToEdit }) => {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("video"); // video o texto
  const [portada, setPortada] = useState("");

  // Llenar campos si es edición
  useEffect(() => {
    if (contentToEdit) {
      setTitulo(contentToEdit.titulo || "");
      setTipo(contentToEdit.tipo || "video");
      setPortada(contentToEdit.portada || "");
    } else {
      setTitulo("");
      setTipo("video");
      setPortada("");
    }
  }, [contentToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo) {
      alert("El título es obligatorio");
      return;
    }

    const data = { titulo, tipo, portada };

    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{contentToEdit ? "Editar contenido" : "Crear contenido"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Título */}
          <label>
            Título:
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </label>

          {/* Tipo */}
          <label>
            Tipo de contenido:
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="video">Video</option>
              <option value="texto">Texto</option>
            </select>
          </label>

          {/* VIDEO: pide portada */}
          {tipo === "video" && (
            <label>
              Portada:
              <input
                type="text"
                value={portada}
                placeholder="URL de imagen de portada"
                onChange={(e) => setPortada(e.target.value)}
              />
            </label>
          )}

          {/* TEXTO: NO pide URL, solo portada opcional */}
          {tipo === "texto" && (
            <label>
              Portada (opcional):
              <input
                type="text"
                value={portada}
                placeholder="URL de portada"
                onChange={(e) => setPortada(e.target.value)}
              />
            </label>
          )}

          <div className="modal-buttons">
            <button type="submit" className="btn-save">
              {contentToEdit ? "Actualizar" : "Guardar"}
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

export default ContenidoModal;
