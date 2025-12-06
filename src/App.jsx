import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer, toast } from 'react-toastify';
import CrearSeccion from './pages/CrearSeccion/CrearSeccion'
import SeccionPage from './pages/SeccionPage/SeccionPage'
import CrearContenido from './pages/CrearContenido/CrearContenido'

const App = () => {

  const navigate = useNavigate();

  useEffect(() =>{
    onAuthStateChanged(auth, async (user) => {
      if(user){
        console.log("Logged in")
        navigate("/")
      }
      else{
        console.log("Logged out")
        navigate("/login")
      }
    })
  },[])

  return (
    <div>
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/player/:mainSectionId/:subId/:contenidoId" element={<Player />} />
        <Route path='/crear-seccion' element={<CrearSeccion/>} />
        <Route path='/seccion/:id' element={<SeccionPage/>}>
          
        </Route>
        <Route path='/seccion/:id/crear' element={<CrearContenido/>}/>
        
      </Routes>
      
    </div>
  )
}

export default App