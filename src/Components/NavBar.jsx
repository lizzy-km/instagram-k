import React from "react";
import { useDispatch } from "react-redux";
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

  return (
    <>
      <header className=" flex justify-between items-center h-[60px] bg-[#212121]    w-full px-2 ">
        <LeftNav/>
        <MidNAv/>
        <RightNav/>
      </header>
    </>
  );
};

export default NavBar;
