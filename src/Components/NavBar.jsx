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
        
      }} className=" flex justify-between items-center  bg-[#212121]    w-full px-2 ">
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
