import React, { useEffect, useState } from "react";
import "./CategoriasModal.css";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

const SmallModal = ({ title, children, onClose }) => (
  <div className="small-modal-overlay">
    <div className="small-modal">
      <div className="small-modal-header">
        <h4>{title}</h4>
        <button className="close-small" onClick={onClose}>✕</button>
      </div>
      <div className="small-modal-body">{children}</div>
    </div>
  </div>
);

const CategoriasModal = ({ isOpen, onClose, mainSectionId, subId, contenido }) => {
  const [categorias, setCategorias] = useState([]);
  const [expandedCatId, setExpandedCatId] = useState(null);
  const [items, setItems] = useState([]);

  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catTítulo, setCatTítulo] = useState("");

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemTitulo, setItemTitulo] = useState("");
  const [itemUrl, setItemUrl] = useState("");

  // Cargar categorías
  useEffect(() => {
    if (!isOpen || !mainSectionId || !subId || !contenido?.id) return;

    const colRef = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenido.id,
      "categorias"
    );

    const q = query(colRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setCategorias(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [isOpen, mainSectionId, subId, contenido]);

  // Cargar items cuando se expande una categoría
  useEffect(() => {
    if (!expandedCatId) {
      setItems([]);
      return;
    }
    if (!mainSectionId || !subId || !contenido?.id) return;

    const colRef = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenido.id,
      "categorias",
      expandedCatId,
      "items"
    );

    const q = query(colRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [expandedCatId, mainSectionId, subId, contenido]);

  // Crear / editar categoría
  const openCreateCat = () => {
    setEditingCat(null);
    setCatTítulo("");
    setShowCatForm(true);
  };

  const openEditCat = (cat) => {
    setEditingCat(cat);
    setCatTítulo(cat.titulo || "");
    setShowCatForm(true);
  };

  const saveCategory = async () => {
    if (!catTítulo.trim()) return alert("Escribe un título");

    const colRef = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenido.id,
      "categorias"
    );

    if (editingCat) {
      await updateDoc(doc(colRef, editingCat.id), { titulo: catTítulo });
    } else {
      await addDoc(colRef, { titulo: catTítulo, createdAt: serverTimestamp() });
    }

    setShowCatForm(false);
    setEditingCat(null);
    setCatTítulo("");
  };

  // Eliminar categoría (primero borrar items)
  const deleteCategory = async (catId) => {
    if (!window.confirm("¿Eliminar categoría y todo su contenido?")) return;

    const itemsCol = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenido.id,
      "categorias",
      catId,
      "items"
    );

    // borrar items manualmente
    const snap = await getDocs(itemsCol);
    const deletes = snap.docs.map((d) => deleteDoc(doc(itemsCol, d.id)));
    // esperar
    await Promise.all(deletes);

    // borrar la categoría
    await deleteDoc(
      doc(
        db,
        "secciones",
        mainSectionId,
        "subsecciones",
        subId,
        "contenidos",
        contenido.id,
        "categorias",
        catId
      )
    );

    if (expandedCatId === catId) setExpandedCatId(null);
  };

  // Items CRUD
  const openCreateItem = () => {
    setEditingItem(null);
    setItemTitulo("");
    setItemUrl("");
    setShowItemForm(true);
  };

  const openEditItem = (it) => {
    setEditingItem(it);
    setItemTitulo(it.titulo);
    setItemUrl(it.url);
    setShowItemForm(true);
  };

  const saveItem = async () => {
    if (!itemTitulo.trim() || !itemUrl.trim()) return alert("Completa título y URL");

    const itemsColRef = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenido.id,
      "categorias",
      expandedCatId,
      "items"
    );

    if (editingItem) {
      await updateDoc(doc(itemsColRef, editingItem.id), { titulo: itemTitulo, url: itemUrl });
    } else {
      await addDoc(itemsColRef, { titulo: itemTitulo, url: itemUrl, createdAt: serverTimestamp() });
    }

    setShowItemForm(false);
    setEditingItem(null);
    setItemTitulo("");
    setItemUrl("");
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("¿Eliminar este documento?")) return;

    await deleteDoc(
      doc(
        db,
        "secciones",
        mainSectionId,
        "subsecciones",
        subId,
        "contenidos",
        contenido.id,
        "categorias",
        expandedCatId,
        "items",
        itemId
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="cat-modal-overlay">
      <div className="cat-modal">
        <button className="cat-close" onClick={onClose}>✕</button>
        <h2>Categorías: {contenido?.titulo || ""}</h2>

        <div className="cat-body">
          <div className="cat-sidebar">
            <button className="btn-add" onClick={openCreateCat}>➕ Nueva categoría</button>

            <ul className="cat-list">
              {categorias.map((c) => (
                <li key={c.id} className={expandedCatId === c.id ? "active" : ""}>
                  <div className="cat-row">
                    <span className="cat-title" onClick={() => setExpandedCatId(expandedCatId === c.id ? null : c.id)}>{c.titulo}</span>
                    <div className="cat-actions">
                      <button onClick={() => openEditCat(c)}>✏️</button>
                      <button onClick={() => deleteCategory(c.id)}>🗑</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="cat-content">
            {!expandedCatId ? (
              <p>Selecciona una categoría para ver sus contenidos.</p>
            ) : (
              <>
                <div className="cat-content-header">
                  <h3>{categorias.find(x => x.id === expandedCatId)?.titulo || ""}</h3>
                  <button className="btn-add" onClick={openCreateItem}>➕ Agregar documento</button>
                </div>

                <ul className="items-list">
                  {items.length === 0 && <p>No hay documentos aún.</p>}
                  {items.map((it) => (
                    <li key={it.id} className="item-row">
                      <a href={it.url} target="_blank" rel="noreferrer">{it.titulo}</a>
                      <div className="item-actions">
                        <button onClick={() => openEditItem(it)}>✏️</button>
                        <button onClick={() => deleteItem(it.id)}>🗑</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Small modals for create/edit category and item */}
        {showCatForm && (
          <SmallModal title={editingCat ? "Editar categoría" : "Nueva categoría"} onClose={() => setShowCatForm(false)}>
            <label>Título</label>
            <input value={catTítulo} onChange={(e) => setCatTítulo(e.target.value)} />
            <div style={{ marginTop: 10, textAlign: "right" }}>
              <button onClick={() => { setShowCatForm(false); setEditingCat(null); }}>Cancelar</button>
              <button onClick={saveCategory} style={{ marginLeft: 8 }}>Guardar</button>
            </div>
          </SmallModal>
        )}

        {showItemForm && (
          <SmallModal title={editingItem ? "Editar documento" : "Nuevo documento"} onClose={() => setShowItemForm(false)}>
            <label>Título</label>
            <input value={itemTitulo} onChange={(e) => setItemTitulo(e.target.value)} />
            <label style={{ marginTop: 8 }}>URL (Google Drive)</label>
            <input value={itemUrl} onChange={(e) => setItemUrl(e.target.value)} placeholder="https://drive.google.com/..." />
            <div style={{ marginTop: 10, textAlign: "right" }}>
              <button onClick={() => { setShowItemForm(false); setEditingItem(null); }}>Cancelar</button>
              <button onClick={saveItem} style={{ marginLeft: 8 }}>Guardar</button>
            </div>
          </SmallModal>
        )}
      </div>
    </div>
  );
};

export default CategoriasModal;
