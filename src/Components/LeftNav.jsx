import React from "react";
import { NavLink } from "react-router-dom";

const LeftNav = () => {
  return (
    <section className=" flex w-[30%] justify-start gap-2 items-center left_nav h-full ">
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

      <div className=" bg-[#2d2d2d] outline-1 outline- px-2 flex h-[40px] w-[75%] rounded-full justify-start items-center ">
        <img
          className=" cursor-pointer px-2 "
          src="/src/Components/assets/Search.svg"
          alt=""
        />

        <input
          className=" text-[#d4d4d4] bg-transparent p-2 outline-none rounded-full "
          placeholder="Search on facebook"
          type="text"
          name=""
          id=""
        />
      </div>
    </section>
  );
};

export default LeftNav;
