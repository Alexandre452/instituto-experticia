import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
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
} from "firebase/firestore";
import VideoModal from "../../components/VideoModal/VideoModal";
import "./Player.css";

const Player = () => {
  // 🔹 Tomar parámetros desde la URL
  const { mainSectionId, subId, contenidoId } = useParams();

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // 🔹 Escuchar videos de Firestore
  useEffect(() => {
    if (!mainSectionId || !subId || !contenidoId) return;

    const videosCol = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenidoId,
      "videos"
    );

    const q = query(videosCol, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const vids = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(vids);
      if (!selectedVideo && vids.length > 0) setSelectedVideo(vids[0]);
    });

    return () => unsub();
  }, [mainSectionId, subId, contenidoId]);

  // 🔹 Extraer ID de YouTube
  const extractYoutubeId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : url;
  };

  // 🔹 Guardar o editar video
  const handleSaveVideo = async (data) => {
    if (!mainSectionId || !subId || !contenidoId) return;

    const videosCol = collection(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenidoId,
      "videos"
    );

    const videoId = extractYoutubeId(data.url);

    if (editingVideo && editingVideo.id) {
      const docRef = doc(videosCol, editingVideo.id);
      await updateDoc(docRef, { titulo: data.titulo, url: videoId, updatedAt: serverTimestamp() });
    } else {
      await addDoc(videosCol, { titulo: data.titulo, url: videoId, createdAt: serverTimestamp() });
    }

    setShowVideoModal(false);
    setEditingVideo(null);
  };

  // 🔹 Eliminar video
  const handleDeleteVideo = async (id) => {
    if (!window.confirm("¿Eliminar este video?")) return;

    const docRef = doc(
      db,
      "secciones",
      mainSectionId,
      "subsecciones",
      subId,
      "contenidos",
      contenidoId,
      "videos",
      id
    );

    await deleteDoc(docRef);
  };

  return (
    <div className="player-container">
      {/* Lista de videos */}
      <div className="video-list">
        <h3>Videos</h3>
        <button
          className="btn-add"
          onClick={() => {
            setEditingVideo(null);
            setShowVideoModal(true);
          }}
        >
          ➕ Agregar video
        </button>

        <ul>
          {videos.map((video) => (
            <li
              key={video.id}
              className={selectedVideo?.id === video.id ? "active" : ""}
            >
              <span onClick={() => setSelectedVideo(video)}>{video.titulo}</span>
              <div className="video-actions">
                <button
                  onClick={() => {
                    setEditingVideo(video);
                    setShowVideoModal(true);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDeleteVideo(video.id)}>🗑</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Reproductor */}
      <div className="video-player">
        {selectedVideo ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selectedVideo.url}`}
            title={selectedVideo.titulo}
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <p>Selecciona un video</p>
        )}
      </div>

      {/* Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => {
          setShowVideoModal(false);
          setEditingVideo(null);
        }}
        onSave={handleSaveVideo}
        videoToEdit={editingVideo}
      />
    </div>
  );
};

export default Player;
