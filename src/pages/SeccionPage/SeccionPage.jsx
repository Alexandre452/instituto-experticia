import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import SubseccionModal from "../../components/SubseccionModal/SubseccionModal";
import ContenidoModal from "../../components/ContenidoModal/ContenidoModal";
import TitleCards from "../../components/TitleCards/TitleCards";
import CategoriasModal from "../../components/CategoriasModal/CategoriasModal";
import "./SeccionPage.css";

const SeccionPage = () => {
  const { id } = useParams(); // id de la sección
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState(null);
  const [subsecciones, setSubsecciones] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  // Modales
  const [showSubModal, setShowSubModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const [showCategoriasModal, setShowCategoriasModal] = useState(false);

  // 🔹 Cargar sección
  useEffect(() => {
    const fetchSeccion = async () => {
      const docRef = doc(db, "secciones", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setSeccion({ id: docSnap.id, ...docSnap.data() });
    };
    fetchSeccion();
  }, [id]);

  // 🔹 Listener de subsecciones
  useEffect(() => {
    const colRef = collection(db, "secciones", id, "subsecciones");
    const unsub = onSnapshot(colRef, (snapshot) => {
      setSubsecciones(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });
    return () => unsub();
  }, [id]);

  // 🔹 Crear subsección
  const handleSaveSubsection = async (data) => {
    const colRef = collection(db, "secciones", id, "subsecciones");
    await addDoc(colRef, { titulo: data.titulo });
    setShowSubModal(false);
  };

  // 🔹 Eliminar subsección
  const handleDeleteSubsection = async (subId) => {
    if (!window.confirm("¿Eliminar subsección?")) return;
    await deleteDoc(doc(db, "secciones", id, "subsecciones", subId));
  };

  // 🔹 Guardar contenido (nuevo o editar)
  const handleSaveContent = async (data) => {
    if (!selectedSub) return;
    const colRef = collection(
      db,
      "secciones",
      id,
      "subsecciones",
      selectedSub.id,
      "contenidos"
    );

    if (editingContent && editingContent.id) {
      await setDoc(doc(colRef, editingContent.id), data, { merge: true });
      setSelectedContent({ ...editingContent, ...data }); // actualizar seleccionado
    } else {
      const docRef = await addDoc(colRef, data);
      setSelectedContent({ id: docRef.id, ...data }); // guardar el nuevo contenido
    }

    setEditingContent(null);
    setShowContentModal(false);
  };

  // Nuevo: decidir qué hacer al seleccionar un contenido
  const handleSelectContent = (content, sub) => {
    // sub puede ser subId, aquí mandamos el objeto sub para setSelectedSub
    // en TitleCards llamamos con onSelectContent(item, subId)
    const subObj = typeof sub === "object" ? sub : { id: sub };

    setSelectedSub(subObj);

    if (content.tipo === "video") {
      // navegar a Player en otra página
      navigate(`/player/${id}/${subObj.id}/${content.id}`);
      return;
    }

    if (content.tipo === "texto") {
      setSelectedContent(content);
      setShowCategoriasModal(true);
      return;
    }

    // por defecto, nada
  };

  if (!seccion) return <p>Cargando sección...</p>;

  return (
    <div className="seccion-page">
      <h1>{seccion.titulo}</h1>

      {/* Crear subsección */}
      <button className="add-sub-btn" onClick={() => setShowSubModal(true)}>
        ➕ Crear subsección
      </button>

      <div className="subsecciones-list">
        {subsecciones.map((sub) => (
          <div className="sub-card" key={sub.id}>
            <div className="sub-header">
              <h3>{sub.titulo}</h3>
              <div className="sub-actions">
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteSubsection(sub.id)}
                >
                  🗑 Eliminar subsección
                </button>
              </div>
            </div>

            {/* TitleCards para listar contenidos */}
            <TitleCards
              mainSectionId={id}
              subId={sub.id}
              onAddContent={() => {
                setSelectedSub(sub);
                setEditingContent(null);
                setShowContentModal(true);
              }}
              onEditContent={(content) => {
                setSelectedSub(sub);
                setEditingContent(content);
                setShowContentModal(true);
              }}
              onSelectContent={(content, sId) => handleSelectContent(content, sub)}
            />
          </div>
        ))}
      </div>

      {/* Modales */}
      <SubseccionModal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        onSave={handleSaveSubsection}
      />

      <ContenidoModal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        onSave={handleSaveContent}
        contentToEdit={editingContent}
      />

      {/* Categorias modal (centrado) */}
      <CategoriasModal
        isOpen={showCategoriasModal}
        onClose={() => {
          setShowCategoriasModal(false);
          setSelectedContent(null);
        }}
        mainSectionId={id}
        subId={selectedSub?.id}
        contenido={selectedContent}
      />
    </div>
  );
};

export default SeccionPage;
