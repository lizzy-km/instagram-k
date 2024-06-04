import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";

const ImageCard = ({d}) => {
    const { userAvatar } = useSelector(
        (state) => state.authSlice
      );
  return (
    <div className=" w-[250px] h-auto p-2 flex flex-col gap-3 justify-start items-start  rounded-lg " >
    <img className=" w-[250px] h-full object-cover rounded-lg " src={d.url} alt="" srcset="" />

    <div className=" w-auto h-full  gap-2    flex justify-start p-2 items-center ">
        <NavLink
          to={`/${d.UID}`}
          className=" rounded- relative w-[30px]  h-[30px] justify-center items-center  bg-[#ca3e4796] "
        >
          <div className=" -z-10 rotate-[10deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[28px] h-[28px] absolute "></div>
          <div className=" -z-10 rotate-[20deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[28px] h-[28px] absolute "></div>
          <div className=" -z-10 rotate-[40deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[28px] h-[28px] absolute "></div>
          <div className=" -z-10 rotate-[60deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[28px] h-[28px] absolute "></div>
          <div className=" -z-10 rotate-[80deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[28px] h-[28px] absolute "></div>

          <img
            className=" w-full   h-full rounded-full object-cover cursor-pointer "
            src={d.userProfile?.length > 0 ? d.userProfile : userAvatar}
            alt=""
            srcset=""
          />
        </NavLink>
        <NavLink
          to={`/${d.UID}`}
          className=" cursor-pointer rounded-br px-2 object-cover  h-full min-w-[100px]  w-auto flex justify-start items-center tracking-wide text-sm  "
        >
          <p>{d.name}</p>
        </NavLink>
      </div>
  </div>
  )
}

export default ImageCard
