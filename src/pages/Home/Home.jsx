import React, { useEffect, useState } from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import hero_banner from '../../assets/hero_banner.png'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { db } from "../../firebase"
import { collection, onSnapshot } from "firebase/firestore"

const Home = () => {

  const [secciones, setSecciones] = useState([]);

  // 🔥 Cargar secciones desde Firestore en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "secciones"), (snapshot) => {
      setSecciones(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  return (
    <div className='home'>
        <Navbar/>

        {/* HERO */}
        <div className='hero'>
          <img src={hero_banner} alt="" className='banner-img' />
          <div className='hero-caption'>
            <div className="hero-btns"></div>
          </div>
        </div>

        <div className="more-cards">

          {/* 🔥 Render dinámico de secciones */}
          {secciones.map(sec => (
            <TitleCards 
              key={sec.id}
              title={sec.titulo}
              sectionId={sec.id}
              tipo={sec.tipo}   // <--- videos, pdf, etc.
            />
          ))}

          <Footer/>
        </div>
    </div>
  )
}

export default Home
