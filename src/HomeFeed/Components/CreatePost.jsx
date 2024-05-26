import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { blurOn } from "../../redux/services/animateSlice";

const CreatePost = () => {
  const dispatch = useDispatch();
  const createPost = () => {
    dispatch(blurOn({ blur: true }));
  };

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  const { adminProfile } = useSelector(
    (state) => state.authSlice
  );

  return (
    <>
      <div className=" tracking-wider  flex w-full my-2 p-2 min-h-[60px] bg-[#242526] rounded-md  ">
        <div className=" px-2 flex rounded-md justify-between flex-col items-center w-full h-full ">
          <div className=" flex justify-between items-center w-full h-full   ">
            <div className=" flex cursor-pointer  rounded-full  bg-[#333333] ">
              <img
                className=" hover:brightness-75 rounded-full object-cover w-[40px] h-[40px] p-[3px]"
                src={adminProfile}
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

        
        </div>
      </div>
    </>
  );
};

export default CreatePost;
