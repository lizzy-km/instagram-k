import React from 'react'
import { useDispatch } from 'react-redux'
import { setLogin } from '../redux/services/authSlice'

const Login = () => {

    const dispatch = useDispatch()

    const Login = ()=> {
        dispatch(setLogin(true))
    }
  return (
    <div>
     <div onClick={Login} >
     Login
     </div> 
    </div>
  )
}

export default Login
