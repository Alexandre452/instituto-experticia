import React, { use, useState } from 'react'
import './Login.css'
import logo from '../../assets/Logo.jpg'
import {login, signup} from '../../firebase'
import spinner from '../../assets/spinner.gif'

const Login = () => {
  const [signState, setSignState] = useState("Ingresar");
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const user_auth = async (event) =>{
    event.preventDefault();
    setLoading(true)
    if(signState==="Ingresar"){
      await login(email, password);
    }else{
      await signup(name, email, password)
    }
    setLoading(false)
  }


  return (
    loading?<div className='login-spinner'>
      <img src={spinner} alt="" />
    </div>:
    <div className='login'>
      <img src={logo} className='login-logo' alt="" />
      <div className='login-form'> 
        <h1>{signState}</h1>
        <form>
          {signState==="Sign Up"?
          <input value={name} onChange={(e) => {setName(e.target.value)}} type="text" placeholder='Usuario' /> : <></>}
          
          <input value={email} onChange={(e) => {setEmail(e.target.value)}} type="email" placeholder='Email' />
          <input value={password} onChange={(e) => {setPassword(e.target.value)}} type="password" placeholder='Contraseña' />
          <button onClick={user_auth} type='submit'>{signState}</button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Recuérdame</label>
            </div>
            <p>¿Necesita Ayuda?</p>
          </div>
        </form>
        <div className='form-switch'>
          {signState==="Ingresar"?
          <p>Nuevo en Experticia <span onClick={()=> setSignState("Sign Up")}>Sign Up Now</span></p>
          :<p>Con una cuenta <span onClick={()=> setSignState("Ingresar")}>Ingresar ahora</span></p>}
          
          
        </div>
      </div>
    </div>
  )
}

export default Login