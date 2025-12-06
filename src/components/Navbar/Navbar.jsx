import React, { useEffect, useState, useRef } from 'react'
import './Navbar.css'
import Logo from '../../assets/Logo.jpg'
import search_icon from '../../assets/busqueda.svg'
import profile_img from '../../assets/perfil.svg'
import caret_icon from '../../assets/caret.svg'
import { logout } from '../../firebase'
import { db } from "../../firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { Link } from 'react-router-dom'

const Navbar = () => {

    const navRef = useRef();
    const [secciones, setSecciones] = useState([]);

    // Cambiar navbar al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 80) {
                navRef.current.classList.add("nav-dark");
            } else {
                navRef.current.classList.remove("nav-dark");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cargar secciones desde Firestore
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "secciones"), (snapshot) => {
            setSecciones(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
        });

        return () => unsub();
    }, []);

    return (
        <div ref={navRef} className='navbar'>
            <div className="navbar-left">
                <img src={Logo} alt="logo" />

                <ul>

                    {/* Página Principal */}
                    <li>
                        <Link to="/" className='link'>Página Principal</Link>
                    </li>

                    {/* Secciones Dinámicas */}
                    {secciones.map(s => (
                        <li key={s.id}>
                            <Link to={`/seccion/${s.id}`} style={{textDecoration:"none", color:"white", fontSize:"18px"}}>{s.titulo}</Link>
                        </li>
                    ))}

                </ul>
            </div>

            <div className="navbar-right">
                <img src={search_icon} className='icons' alt="buscar" />
                <p>Children</p>

                {/* PERFIL */}
                <div className="navbar-profile">
                    <img src={profile_img} className='profile' alt="perfil" />
                    <img src={caret_icon} className='icons' alt="menu" />

                    <div className='dropdown'>
                        <p>
                            <Link to="/crear-seccion">+ Crear sección</Link>
                        </p>
                        <p onClick={logout}>Salir de Experticia</p>

                        {/* Solo para profesores (después lo condicionas con rol) */}
                        
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Navbar
