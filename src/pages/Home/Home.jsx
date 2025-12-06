import React, { useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import hero_banner from '../../assets/hero_banner.png';
import TitleCardsPreview from '../../components/TitleCardsPreview/TitleCardsPreview';
import Footer from '../../components/Footer/Footer';
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [sectionsData, setSectionsData] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const secSnap = await getDocs(collection(db, "secciones"));
      const data = [];

      for (const secDoc of secSnap.docs) {
        const sec = { id: secDoc.id, ...secDoc.data(), preview: [] };

        const subSnap = await getDocs(
          collection(db, "secciones", sec.id, "subsecciones")
        );

        for (const subDoc of subSnap.docs) {
          const subId = subDoc.id;
          const subData = subDoc.data();

          const contSnap = await getDocs(
            collection(
              db,
              "secciones",
              sec.id,
              "subsecciones",
              subId,
              "contenidos"
            )
          );

          const contenidos = contSnap.docs.map(d => ({
            id: d.id,
            ...d.data(),
          }));

          if (contenidos.length > 0) {
            const randomContent =
              contenidos[Math.floor(Math.random() * contenidos.length)];

            sec.preview.push({
              ...randomContent,
              subId,
              subTitulo: subData.titulo, // 🔥 AGREGADO
            });
          }
        }

        data.push(sec);
      }

      setSectionsData(data);
    };

    fetchSections();
  }, []);

  return (
    <div className="home">
      <Navbar />

      <div className="hero">
        <img src={hero_banner} alt="" className="banner-img" />
      </div>

      <div className="more-cards">
        {sectionsData.map((sec) => (
          <TitleCardsPreview
            key={sec.id}
            title={sec.titulo}
            sectionId={sec.id}
            preview={sec.preview} // incluye subTitulo
          />
        ))}

        <Footer />
      </div>
    </div>
  );
};

export default Home;
