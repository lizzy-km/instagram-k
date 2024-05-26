import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {

    const navigate = useNavigate()

    useEffect(()=> {
        setTimeout( navigate('/watch'),500)

    },[])

  return (
    <div>
      
    </div>
  )
}

export default Loading
