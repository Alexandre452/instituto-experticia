import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import Logo from '../../assets/Logo.jpg';
import search_icon from '../../assets/busqueda.svg';
import profile_img from '../../assets/perfil.svg';
import caret_icon from '../../assets/caret.svg';
import menu_icon from '../../assets/menu.svg';  // <-- Añade un icono hamburguesa
import close_icon from '../../assets/close.svg'; // <-- Icono para cerrar
import { logout } from '../../firebase';
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from 'react-router-dom';

const Navbar = () => {

    const navRef = useRef();
    const [secciones, setSecciones] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false); // <-- MENU MOVIL

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

    // Cargar secciones
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
        <>
            {/* OVERLAY con BLUR */}
            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}

            <div ref={navRef} className='navbar'>

                {/* Left */}
                <div className="navbar-left">
                    <img src={Logo} alt="logo" />

                    {/* ☰ MENU HAMBURGUESA solo móvil */}
                    <img
                        src={menu_icon}
                        className="menu-btn"
                        alt="menu"
                        onClick={() => setMenuOpen(true)}
                    />

                    {/* MENU DESKTOP */}
                    <ul className="desktop-menu">
                        <li><Link to="/" className='link'>Página Principal</Link></li>

                        {secciones.map(s => (
                            <li key={s.id}>
                                <Link to={`/seccion/${s.id}`} className="link">{s.titulo}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right */}
                <div className="navbar-right">
                    <img src={search_icon} className='icons' alt="buscar" />
                    <p>Children</p>

                    <div className="navbar-profile">
                        <img src={profile_img} className='profile' alt="perfil" />
                        <img src={caret_icon} className='icons' alt="menu" />

                        <div className='dropdown'>
                            <p><Link to="/crear-seccion">+ Crear sección</Link></p>
                            <br />
                            <p onClick={logout}>Salir de Experticia</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MENU MÓVIL SLIDE */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                <img
                    src={close_icon}
                    className="close-btn"
                    alt="cerrar"
                    onClick={() => setMenuOpen(false)}
                />

                <Link to="/" onClick={() => setMenuOpen(false)}>Página Principal</Link>

                {secciones.map(s => (
                    <Link
                        key={s.id}
                        to={`/seccion/${s.id}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        {s.titulo}
                    </Link>
                ))}

                <hr />

                <p onClick={() => { logout(); setMenuOpen(false); }}>Salir</p>
            </div>
        </>
    );
};

export default Navbar;
