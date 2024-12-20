import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { blurOn, isDeskTop, isTablet } from "../../redux/services/animateSlice";

const CreatePost = ({position='feed'}) => {
  const dispatch = useDispatch();
  const createPost = () => {
    dispatch(blurOn({ blur: true }));
  };

  const {  isTablet,isMobile } = useSelector(
    (state) => state.animateSlice
  );

  const { adminProfile,userAvatar,admin } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  function getFirstWord(text) {
    if (!text) return ""; // Handle empty string case
  
    const words = text.split(' ');
    return words[0] || ""; // Return first word or empty string if no words found
  }
  
  // Example usage
  const text = admin?.user_name?.stringValue;
  const firstWord = getFirstWord(text);


  return (
    <>
      <div style={{
        width: !isTablet ? '100%':'90%',
      }} className=" tracking-wider self-center justify-center items-center  flex  py-2 p-3 min-h-[80px] bg-[#242526] rounded-md  ">
        <div className=" px-2 flex rounded-md justify-between flex-col items-center w-full h-full ">
          <div className=" flex justify-between gap-2 items-center w-full h-full   ">
            <div className=" flex cursor-pointer  rounded-full  bg-[#333333] ">
              <img
                className=" invert-none hover:brightness-75 rounded-full object-cover w-[40px] h-[40px] p-[3px]"
                src={adminProfile?.length > 0 ? adminProfile:userAvatar}
                alt=""
                srcSet=""
              />
            </div>
            <div className=" flex justify-start items-center w-[93%] rounded-full bg-[#333333] h-[40px] ">
              <input
                onClick={() => createPost()}
                placeholder={`What's on your mind, ${firstWord}?`}
                className="  outline-none bg-transparent px-4 text-[#d4d4d4] w-full rounded-full h-[40px] "
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
