import React from 'react'
import './Footer.css'
import facebook from '../../assets/face.svg'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-icons">
        <img src={facebook} alt="" />
        <img src={facebook} alt="" />
        <img src={facebook} alt="" />
        <img src={facebook} alt="" />
      </div>
      <ul>
        <li>Audio Description</li>
        <li>Audio Description</li>
        <li>Audio Description</li>
        <li>Audio Description</li>
        <li>Audio Description</li>
        <li>Links</li>
        <li>Términos</li>
        <li>Privacidad</li>
        <li>Noticias</li>
        <li>Preferencias</li>
        <li>Información</li>
        <li>Contactanos</li>
      </ul>
      <p className='copyright-text'>@ 2021-2025 Instituto Experticia, Inc.</p>
    </div>
  )
}

export default Footer