import React from "react";
import StoryCard from "./StoryCard";

const Story = () => {
  let array = [
    {
      id: 0,
    },
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
  ];

  return (
    <div className=" absolute top-3 w-full h-[250px] mini-h-[250px] flex justify-start items-center gap-3   ">
      <div className=" h-full gap-3 flex overflow-x-auto overflow-y-hidden  justify-start items-center ">
        <div className=" p-0 shadow-md flex min-w-[140.6px] h-full bg-[#242526] rounded-md ">
          <div className=" h-full flex flex-col justify-between items-center rounded-md ">
            <div className="h-[80%] z-0  bg-center object-center    object-cover rounded-t-md ">
              <img
                className=" cursor-pointer hover:size-[102%] h-[100%]  bg-center object-center    object-cover rounded-t-md "
                src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
                alt="profile_picture"
                srcset=""
              />
            </div>

            <div className=" z-n1  relative w-full h-[20%] flex rounded-b-md justify-center items-center ">
              <div className=" p-[3px] absolute bg-[#242526] rounded-full w-[40px] h-[40px] top-[-30%] ">
                <div className=" cursor-pointer flex justify-center items-center relative rounded-full w-full h-full bg-[#0866ff] ">
                  <div className=" w-[50%] rounded-full h-[2px] bg-slate-200 "></div>
                  <div className=" absolute w-[2px] rounded-full h-[50%] bg-slate-200 "></div>
                </div>
              </div>
              <div className=" flex justify-center items-center pt-3 text-[0.8rem] font-[600] w-full  ">
                Create story
              </div>
            </div>
          </div>
        </div>

        {array?.length > 0 &&
          array?.map((arr) => {
            return <StoryCard key={arr?.id} />;
          })}
      </div>
    </div>
  );
};

export default Story;
