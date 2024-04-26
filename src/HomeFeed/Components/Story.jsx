import React, { useState } from "react";
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

  const [plus,setPlus] = useState(false)

  const createStory = () => {
    setPlus(!plus)
  }

  const [translateX,setTranslateX] = useState(0)

  const translateStoryCard = () => {
    array.length*150-500 >= translateX ?
    setTranslateX(translateX+array.length*150/4) :
    setTranslateX(0)
  }

  return (
    <div className=" story  ">
      <div
      
       className=" story-holder  ">
        <div
       
         className=" nextStory   " >
          <div onClick={translateStoryCard} className=" moveStory " >
            <div className=" absolute top-[37%] left-[37%] rotate-45 w-[30%] h-[2px] bg-[#d4d4d4] rounded-full " >
              
            </div>
            <div className=" absolute bottom-[37%] left-[37%] rotate-[135deg] w-[30%] h-[2px] bg-[#d4d4d4] rounded-full " >
              
            </div>
          </div>
        </div>
        <div
         style={{
          translate:-translateX
         }}
         className=" storyCreateCard   ">
          <div className=" h-full flex flex-col justify-between items-center rounded-md ">
            <div className="max-h-[80%] h-[80%] z-0  bg-center object-center overflow-hidden    object-cover rounded-t-md ">
              <img
                className=" cursor-pointer hover:size-[102%] h-[100%]  bg-center object-center    object-cover rounded-t-md "
                src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
                alt="profile_picture"
                srcSet=""
              />
            </div>

            <div className=" z-n1  relative w-full h-[20%] flex rounded-b-md justify-center items-center ">
              <div className=" p-[3px] absolute bg-[#242526] rounded-full w-[40px] h-[40px] top-[-30%] ">
                <div
                onClick={createStory}
                 style={{
                    rotate: plus === true ? '180deg' : '0deg'
                }} className=" cursor-pointer flex justify-center items-center relative rounded-full w-full h-full bg-[#0866ff] ">
                  <div className=" w-[50%] rounded-full h-[2px] bg-slate-200 "></div>
                  <div className=" absolute w-[2px] rounded-full h-[50%] bg-slate-200 "></div>
                </div>
              </div>
              <div className=" flex justify-center items-center pt-4 text-[0.8rem] font-[600] w-full tracking-wide  ">
                Create story
              </div>
            </div>
          </div>
        </div>

        {array?.length > 0 &&
          array?.map((arr) => {
            return <StoryCard translateX={translateX} key={arr?.id} />;
          })}
      </div>
    </div>
  );
};

export default Story;
