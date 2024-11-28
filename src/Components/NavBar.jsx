import React from "react";
import {  useSelector } from "react-redux";
import LeftNav from "./LeftNav";
import MidNAv from "./MidNAv";
import RightNav from "./RightNav";

const NavBar = () => {
  


  const {  isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  return (
    <>
      <header style={{
        
      }} className= {` ${isMobile ? ' flex flex-row-reverse ' :' flex ' } justify-between items-center fixed z-[9999]   py-2   w-full p-${isMobile ? '0':'2'}`} >
        <LeftNav/>
      {
        isDeskTop && <MidNAv/>
      }  
        <RightNav/>
      </header>
    </>
  );
};

export default NavBar;
