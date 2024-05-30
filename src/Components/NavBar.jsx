import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../redux/services/authSlice";
import LeftNav from "./LeftNav";
import MidNAv from "./MidNAv";
import RightNav from "./RightNav";

const NavBar = () => {
  const dispatch = useDispatch();

  const Login = () => {
    dispatch(setLogin(true));
  };

  const Logout = () => {
    dispatch(setLogin(false));
  };

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  return (
    <>
      <header style={{
        
      }} className= {` ${isMobile ? ' flex-col ' :' flex ' } justify-between items-center fixed z-[9999]   py-2   w-full p-${isMobile ? '0':'2'}`} >
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
