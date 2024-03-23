import React from "react";

const RightNav = () => {
  return (
    <section className=" w-[30%] h-full flex justify-end items-center ">
      <div className=" flex-row-reverse flex justify-start gap-3 items-center w-[70%] h-full p-2 ">
        <div className=" bg-[#212121] flex justify-between items-center w-auto h-full ">
          <div className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[3px] bg-[#333333] ">
            <img
              className=" cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
              src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
              alt="profile_picture"
              srcset=""
            />
          </div>

         


        </div>

        <div className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[10px] bg-[#333333] ">
            <img
              className=" cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
              src="/src/Components/assets/Noti.svg"
              alt="profile_picture"
              srcset=""
            />
          </div>
          <div className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[3px] bg-[#333333] ">
            <img
              className=" cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
              src="/src/Components/assets/Messenger.svg"
              alt="profile_picture"
              srcset=""
            />
          </div>
          <div className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[10px] bg-[#333333] ">
            <img
              className=" cursor-pointer hover:brightness-75 h-full   bg-center object-center    object-cover  "
              src="/src/Components/assets/Menu.svg"
              alt="profile_picture"
              srcset=""
            />
          </div>
      </div>
    </section>
  );
};

export default RightNav;
