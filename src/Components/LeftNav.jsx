import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {  setUpdateFeed } from "../redux/services/authSlice";
import { auth } from "../firebase/firebase";

const LeftNav = () => {
  const { isTablet, isMobile } = useSelector(
    (state) => state.animateSlice
  );
  const { updateFeed } = useSelector((deserializedState) => deserializedState.authSlice)

  const dispatch = useDispatch()
  const user = auth?.currentUser?.uid

 useEffect(()=> { 
  user && localStorage.setItem("adminId", user);

 },[])
  return (
    <section style={{
      width:isMobile ? '100%' : isTablet ? '30%' :'30%',
      justifyContent:isMobile ? 'end' :'start',
      padding:isMobile ? '8px' :'0'
    }} className= {` ${isMobile && 'flex-row-reverse'} flex w-[30%]  gap-2 items-center left_nav h-full`} >
      <NavLink onDoubleClick={()=> {
        // window.location.reload(true)
        dispatch(setUpdateFeed(!updateFeed))

        

      } }
        to={"/"}
        className=" cursor-pointer flex rounded-full justify-center items-center "
      >
        <img
          className=" h-[40px] w-[40px] object-cover "
          src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FLogo.svg?alt=media&token=e93a02de-9b36-48e1-a74c-cd7af8dea71a"
          alt=""
        />
      </NavLink>

      <div className=" bg-[#2d2d2d] outline-1 outline- px-1 flex h-[40px] w-[40px] rounded-full justify-start items-center ">
        <img
          className=" cursor-pointer px-2 "
          src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FSearch.svg?alt=media&token=0cc98ba7-3d8f-4f48-ad1c-5aa326bd3201"
          alt=""
        />

       
      </div>
    </section>
  );
};

export default LeftNav;
