import React from "react";
import { useDispatch } from "react-redux";
import { blurOn } from "../../redux/services/animateSlice";

const CreatePost = () => {
  const dispatch = useDispatch();
  const createPost = () => {
    dispatch(blurOn({ blur: true }));
  };

  const closeCreatePost = () => {
    dispatch(blurOn({ blur: false }));
  }

  return (
    <>
      <div className=" tracking-wider  flex w-full my-2 p-2 min-h-[122.6px] bg-[#242526] rounded-md  ">
        <div className=" px-2 flex rounded-md justify-between flex-col items-center w-full h-full ">
          <div className=" flex justify-between items-center w-full h-[60px] border-b-[1px] border-[#333333] ">
            <div className=" flex  rounded-full w-[40px] h-[40px] bg-[#333333] ">
              <img
                className=" rounded-full object-cover w-full h-full "
                src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
                alt=""
                srcSet=""
              />
            </div>
            <div className=" flex justify-start items-center w-[93%] rounded-full bg-[#333333] h-[40px] ">
              <input
                onClick={() => createPost()}
                placeholder="What's on your mind, Kaung?"
                className=" outline-none bg-transparent px-4 text-[#d4d4d4] w-full rounded-full h-[40px] "
                type="text"
                name=""
                id=""
              />
            </div>
          </div>

          <div className=" py-2 h-[30%] w-full flex justify-between items-center ">
            <div className=" px-2 flex justify-center gap-3 items-center w-[25%] h-[40px] rounded-md hover:bg-[#333333] cursor-pointer transition-colors ">
              <div className=" cursor-pointer flex w-[30px] p-1  justify-evenly items-center ">
                <img
                  className=" w-full "
                  src="/src/HomeFeed/Components/assets/Live.png"
                  alt=""
                  srcSet=""
                />
              </div>
              <div className=" flex justify-start items-center text-[#d4d4d4dc] font-[500] tracking-wide ">
                <p>Live video</p>
              </div>
            </div>
            <div className=" px-2 flex justify-center gap-3 items-center w-[25%] h-[40px] rounded-md hover:bg-[#333333] cursor-pointer transition-colors ">
              <div className=" cursor-pointer flex w-[30px] p-1  justify-evenly items-center ">
                <img
                  className=" w-full "
                  src="/src/HomeFeed/Components/assets/Photo.png"
                  alt=""
                  srcSet=""
                />
              </div>
              <div className=" flex justify-start items-center text-[#d4d4d4dc] font-[500] tracking-wide ">
                <p>Photo/Video</p>
              </div>
            </div>
            <div className=" px-2 flex justify-center gap-3 items-center w-[25%] h-[40px] rounded-md hover:bg-[#333333] cursor-pointer transition-colors ">
              <div className=" cursor-pointer flex w-[30px] p-1  justify-evenly items-center ">
                <img
                  className=" w-full "
                  src="/src/HomeFeed/Components/assets/Feeling.png"
                  alt=""
                  srcSet=""
                />
              </div>
              <div className=" flex justify-start items-center text-[#d4d4d4dc] font-[500] tracking-wide ">
                <p>Feeling/Activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
