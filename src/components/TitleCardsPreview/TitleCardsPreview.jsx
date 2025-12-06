import React from "react";
import "./TitleCardsPreview.css";
import { useNavigate } from "react-router-dom";

const TitleCardsPreview = ({ title, sectionId, preview }) => {
  const navigate = useNavigate();

  return (
    <div className="titlecards-preview">
      <h2 className="preview-section-title">{title}</h2>

      <div className="preview-container">
        {preview.length === 0 && (
          <p className="preview-empty">No hay contenidos aún.</p>
        )}

        {preview.map((item) => (
          <div className="preview-item" key={item.id}>
            
            {/* 🔥 Nombre de la subsección */}
            <p className="preview-subtitle">{item.subTitulo}</p>

            <div
              className="preview-card"
              onClick={() =>
                item.tipo === "video"
                  ? navigate(`/player/${sectionId}/${item.subId}/${item.id}`)
                  : window.open(item.url, "_blank")
              }
            >
              <img
                src={item.portada || "https://via.placeholder.com/200x120"}
                alt={item.titulo}
                className="preview-img"
              />
              <div className="preview-info">
                <h4 className="preview-title">{item.titulo}</h4>
                <span className="preview-type">
                  {item.tipo === "video" ? "🎬 Video" : "📄 Texto"}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCardsPreview;
