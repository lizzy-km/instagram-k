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
        to={"/"}
        className=" cursor-pointer flex rounded-full justify-center items-center "
      >
        <img
          className=" h-[40px] w-[40px] object-cover "
          src="/src/Components/assets/Logo.svg"
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
