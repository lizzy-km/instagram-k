import React from 'react'
import { NavLink } from 'react-router-dom'

const NameCard = ({userAvatar,UID,userPfData,name,uploaded_at,time} ) => {
    
  return (
    <div className=" absolute bottom-2 left-0 w-full p-2  h-[55px]   flex justify-start items-center ">
    <div className=" w-auto h-full  gap-2    flex justify-center items-center ">
      <NavLink
        onClick={() =>
          localStorage.setItem(
            "userProfile",
            userPfData?.PFPATH
          )
        }
        to={`/${UID}`}
        className=" rounded- relative w-[40px]  h-[40px] justify-center items-center   "
      >
        <div className=" -z-10 rotate-[0deg] rounded-sm  left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
        <div className=" -z-10 rotate-[20deg] rounded-sm left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
        <div className=" -z-10 rotate-[40deg] left-[1px] rounded-sm top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
        <div className=" -z-10 rotate-[60deg] left-[1px] top-[1px] rounded-sm bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
        <div className=" -z-10 rotate-[80deg] left-[1px] top-[1px] rounded-sm bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>

        <img
          className=" invert-none w-full   h-full rounded-full object-cover cursor-pointer "
          src={
            userPfData?.PFPATH?.length > 0
              ? userPfData?.PFPATH
              : userAvatar
          }
          alt=""
          srcset=""
        />
      </NavLink>
      <NavLink
        to={`/${UID}`}
        className=" flex-col cursor-pointer rounded-br px-2  h-full min-w-[100px]  w-auto flex justify-start items-start tracking-wide text-base  "
      >
        <p>{name}</p>
        <time
          dateTime={uploaded_at}
          datatype="UTC"
          className=" opacity-75 text-[12px] "
        >
          {" "}
          {time}{" "}
        </time>
      </NavLink>
    </div>
  </div>
  )
}

export default NameCard
