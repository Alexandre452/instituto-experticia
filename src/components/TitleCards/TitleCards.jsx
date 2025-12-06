import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import { collection, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import "./TitleCards.css";

const TitleCards = ({
  mainSectionId,
  subId,
  onAddContent,
  onEditContent,
  onSelectContent, // ahora recibe (content, subId)
}) => {
  const [recursos, setRecursos] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    if (!mainSectionId || !subId) return;

    const colRef = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos"
    );

    const unsub = onSnapshot(colRef, (snapshot) => {
      setRecursos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [mainSectionId, subId]);

  useEffect(() => {
    if (cardsRef.current) {
      cardsRef.current.addEventListener("wheel", handleWheel);
    }
  }, []);

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm("¿Eliminar este contenido?")) return;

    const ref = doc(db, "secciones", mainSectionId, "subsecciones", subId, "contenidos", contentId);
    await deleteDoc(ref);
  };

  return (
    <div className="title-cards">
      <div className="title-header">
        <button className="btn-create" onClick={onAddContent}>
          ➕ Crear contenido
        </button>
      </div>

      <div className="card-list" ref={cardsRef}>
        {recursos.length === 0 && <p className="empty-section">Esta subsección aún no tiene contenido.</p>}

        {recursos.map((item) => (
          <div className="card" key={item.id}>
            {/* ahora solo llama onSelectContent, SeccionPage decidirá qué hacer */}
            <div
              className="card-preview"
              onClick={() => onSelectContent(item, subId)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={item.portada || "https://via.placeholder.com/150"}
                alt={item.titulo}
              />
              <div className="title-cards">
                <h2>{item.titulo}</h2>
                <div className="type-icon">{item.tipo === "video" ? "🎬" : "📄"}</div>
              </div>
            </div>

            <div className="card-actions">
              <button className="edit-btn" onClick={() => onEditContent(item)}>
                ✏️ Editar
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDeleteContent(item.id)}
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
