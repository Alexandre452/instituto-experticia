import { useState } from "react";
import "./SubseccionModal.css";

export default function SubseccionModal({
  isOpen,
  onClose,
  onSave,
  sectionType,
}) {
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [portada, setPortada] = useState("");

  const handleSave = () => {
    onSave({
      titulo,
      url,
      portada: sectionType === "texto" ? portada : null,
    });

    setTitulo("");
    setUrl("");
    setPortada("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">Crear subsección</h2>

        <label className="field-label">Título</label>
        <input
          className="field-input"
          placeholder="Nombre de la subsección"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {sectionType === "video" && (
          <>
            <label className="field-label">URL del video</label>
            <input
              className="field-input"
              placeholder="https://youtube.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </>
        )}

        {sectionType === "pdf" && (
          <>
            <label className="field-label">URL del libro</label>
            <input
              className="field-input"
              placeholder="https://drive.google.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <label className="field-label">Portada del libro</label>
            <input
              className="field-input"
              placeholder="URL de imagen…"
              value={portada}
              onChange={(e) => setPortada(e.target.value)}
            />
          </>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
