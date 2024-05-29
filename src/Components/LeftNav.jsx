import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const LeftNav = () => {
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  return (
    <section style={{
      width:isMobile ? '100%' : isTablet ? '30%' :'30%',
      justifyContent:isMobile ? 'start' :'start',
      padding:isMobile ? '8px' :'0'
    }} className=" flex w-[30%] justify-start gap-2 items-center left_nav h-full ">
      <NavLink 
        to={"/loading"}
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
          src="/src/Components/assets/Search.svg"
          alt=""
        />

       
      </div>
    </section>
  );
};

export default LeftNav;
