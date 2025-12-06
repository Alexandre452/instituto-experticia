import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import "./CrearContenido.css";

const CrearContenido = () => {
  const { id } = useParams(); // id de la sección
  const [seccion, setSeccion] = useState(null);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchSeccion = async () => {
      const ref = doc(db, "secciones", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setSeccion(snap.data());
    };
    fetchSeccion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ref = collection(db, "secciones", id, "contenido");

    await addDoc(ref, formData);

    alert("Contenido creado exitosamente");
    window.history.back();
  };

  if (!seccion) return <p>Cargando formulario...</p>;

  // Render dinámico según el tipo
  const renderCampos = () => {
    switch (seccion.tipo) {
      case "video":
        return (
          <>
            <label>Título:</label>
            <input name="titulo" onChange={handleChange} />

            <label>URL del video:</label>
            <input name="url" onChange={handleChange} />
          </>
        );

      case "pdf":
        return (
          <>
            <label>Título:</label>
            <input name="titulo" onChange={handleChange} />

            <label>Archivo PDF:</label>
            <input type="file" accept="application/pdf" name="archivo" onChange={handleChange} />
          </>
        );

      case "cuadernillo":
        return (
          <>
            <label>Título:</label>
            <input name="titulo" onChange={handleChange} />

            <label>Descripción:</label>
            <textarea name="descripcion" onChange={handleChange}></textarea>

            <label>Archivo:</label>
            <input type="file" name="archivo" onChange={handleChange} />
          </>
        );

      case "simulacro":
        return (
          <>
            <label>Archivo:</label>
            <input type="file" name="archivo" onChange={handleChange} />

            <label>Fecha:</label>
            <input type="date" name="fecha" onChange={handleChange} />

            <label>Nivel:</label>
            <select name="nivel" onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="básico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </>
        );

      case "texto":
        return (
          <>
            <label>Título:</label>
            <input name="titulo" onChange={handleChange} />

            <label>Contenido:</label>
            <textarea name="contenido" onChange={handleChange}></textarea>
          </>
        );

      default:
        return <p>Tipo no soportado</p>;
    }
  };

  return (
    <div className="crear-contenido">
      <h1>Crear contenido para {seccion.titulo}</h1>

      <form onSubmit={handleSubmit}>
        {renderCampos()}

        <button type="submit" className="submit-btn">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CrearContenido;
