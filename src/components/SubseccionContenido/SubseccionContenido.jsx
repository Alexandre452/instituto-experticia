import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import TitleCards from "../TitleCards/TitleCards";

const SubseccionContenido = ({ mainSectionId }) => {
  const [subsections, setSubsections] = useState([]);

  useEffect(() => {
    if (!mainSectionId) return;

    // Cargar todas las subsecciones de la sección principal
    const unsub = onSnapshot(
      collection(db, "secciones", mainSectionId, "subsecciones"),
      (snapshot) => {
        setSubsections(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      }
    );

    return () => unsub();
  }, [mainSectionId]);

  return (
    <div>
      {subsections.length === 0 && (
        <p>No hay subsecciones todavía.</p>
      )}

      {subsections.map((sub) => (
        <TitleCards
          key={sub.id}
          title={sub.nombre}
          mainSectionId={mainSectionId}   // el id de la sección padre
          subId={sub.id}                  // id de la subsección
        />
      ))}

    </div>
  );
};

export default SubseccionContenido;
