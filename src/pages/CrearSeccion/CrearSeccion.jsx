import React, { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./CrearSeccion.css"

const CrearSeccion = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("video"); // video, pdf, mixto
  const navigate = useNavigate();

  const handleCrearSeccion = async () => {
    if (!titulo) {
      alert("El título es obligatorio");
      return;
    }

    try {
      await addDoc(collection(db, "secciones"), {
        titulo,
        descripcion,
        tipo,
        fechaCreacion: Date.now()
      });

      alert("Sección creada exitosamente");
      navigate("/"); // vuelve a la página principal
    } catch (error) {
      console.error("Error al crear sección:", error);
      alert("Hubo un error, revisa la consola");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Crear nueva sección</h2>

      <label>Título de la sección</label>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
      />

      <label>Descripción (opcional)</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
      />

      <label>Tipo de contenido</label>
      <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: "100%", marginBottom: "15px", padding: "8px" }}>
        <option value="video">Video</option>
        <option value="pdf">PDF</option>
        <option value="mixto">Mixto</option>
      </select>

      <button onClick={handleCrearSeccion} style={{ padding: "10px 20px", cursor: "pointer" }}>
        ➕ Crear sección
      </button>
    </div>
  );
};

export default CrearSeccion;
