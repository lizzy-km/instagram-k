import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GetAdminData from '../redux/services/Hooks/GetAdminData';
import { useDispatch, useSelector } from 'react-redux';
import { addAdmin, setHasNewStory } from '../redux/services/authSlice';

const Loading = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getAdmin = [GetAdminData()];
    const { admin,hasNewStory } = useSelector((state) => state.authSlice);
  
  
    useEffect(() => {
      Promise.all(getAdmin)
        .then((data) => {
          dispatch(addAdmin(data[0]));
          setTimeout(()=> navigate('/'),100)
        })
        .catch((error) => console.log(error));
    }, []);

    useEffect(()=> {
        dispatch(setHasNewStory(!hasNewStory))

    },[])

  return (
    <div className=' w-full h-screen ' >
      
    </div>
  )
}

export default Loading
