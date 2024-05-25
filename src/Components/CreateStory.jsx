import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowStory, setArea, isTablet } from "../redux/services/animateSlice";
import useChangeChildrenVisibility from "./ChangeChildrenVisibility";
import addData from "../redux/services/Hooks/AddData";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebase";
import UpdateData from "../redux/services/Hooks/UpdateData";
const CreateStory = () => {
    const [option, setOption] = useState("Public");
    const [icon, setIcon] = useState("https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FPublic.png?alt=media&token=e3945f3a-c97e-41f0-b44e-a7027f23df34");
    const { admin } = useSelector((state) => state.authSlice);

    const privacyData = [
      {
        id: "1",
        option: "Public",
        icon: "/src/Components/assets/Public.png",
      },
      {
        id: "2",
        option: "Friends",
        icon: "/src/Components/assets/Friend.png",
      },
      {
        id: "3",
        option: "Only me",
        icon: "/src/Components/assets/OnlyMe.png",
      },
    ];
  
    const dispatch = useDispatch();
    const [privacy, setPrivacy] = useState(false);
    const Create_story = ['Create_story']
    const { showStory,isMobile } = useSelector((state) => state.animateSlice);

  
    useEffect(() => {
      showStory === false
        ? useChangeChildrenVisibility(Create_story, "hidden")
        : useChangeChildrenVisibility(Create_story, "visible");
    }, [showStory, privacy]);
  
    useEffect(() => {
      dispatch(
        setArea({
          width: window.outerWidth,
          height: window.outerHeight,
        })
      );
    }, []);
  
    const [detail, setDetail] = useState("");
    const [imgSrc,setImgSrc] = useState()
    const [inputHeight, setInputHeight] = useState(50);
  
    const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        event.preventDefault();
        setDetail(detail + " " + " \n ");
        // Check for Enter key
        //   setInputHeight(inputHeight + 50);
      }
      if (e.keyCode === 8 && inputHeight > 50) {
        // Check for Enter key
        //   setInputHeight(inputHeight / 2);
      }
    };



    const name = admin?.user_name?.stringValue
    const email = admin?.email?.stringValue

  const bio = "It's me " + name;
  const UID = name?.replace(/ /g, "_") + "Official";


  function getFirstChars() {
    if (!name) return []; // Handle empty string case

    const words = name?.split(" ");
    const firstChars = [];
    for (const word of words) {
      firstChars.push(word[0]);
    }
    return firstChars;
  }


  const firstCharacters = getFirstChars();

  const nick = firstCharacters.length > 0 ? firstCharacters?.reduce((prev, curr) => prev + curr) :null

  
  const shortName = nick;
  const nickName = "qwer";
  const date = new Date().getUTCMilliseconds();


const STID=nick + "ST" + `${date}`





   


    const uploadImage = async (imageFile, filePath) => {
      try {
        const storageRef = ref(storage, filePath); // Replace with your desired file path
        const uploadTask = await uploadBytes(storageRef, imageFile);

        console.log(uploadTask);
    
        // Monitor upload progress (optional)
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
    
        // Get download URL after successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('Image uploaded successfully! URL:', downloadURL);
        return downloadURL; // Or use the URL for other actions
      } catch (error) {
        console.error('Error uploading image:', error);
        return null; // Or handle the error differently
      }
    };
    
    // Example usage
    const imageFile = imgSrc; // Assuming you have a file input element
    const filePath = `user_story/${UID}/${STID}/${imageFile?.name}`; // Replace with your desired file path in Storage
   
    const storyData = {  "STID":nick + "ST" + `${date}`}
  
  
    function CreateNewStory () {

      UpdateData('story',name,storyData)
      uploadImage(imageFile, filePath)
      .then((url) => {
        if (url) {
          // Use the downloaded URL to display the image or perform other actions
          console.log('Image URL:', url);
          // <img src={url} alt="My Image" /> (example usage)
        } else {
          window.location.reload(true)
        }
      });
        
      }
  
    return (
      <div
        id="Create_story"
        style={{
          visibility: showStory === true ? "visible" : "hidden",
          width: isMobile ? '95%' : isTablet ? '90%':'70%'
        }}
        className=" text-[#d4d4d4] p-2  flex flex-col justify-between items-center rounded-md bg-[#18191a]  h-[75%] overflow-y-auto max-h-[75%] "
      >
        <div
          style={{
            width: showStory === true ? "100%" : "100%",
            height: showStory === true ? "100%" : "0%",
          }}
          className=" flex flex-col justify-start items-start "
        >
          <div className=" flex w-full h-[20%] justify-between items-start ">
            <div className=" w-[80%] h-auto p-2  flex flex-col justify-start items-center  rounded-md ">
              <div className=" w-full h-[50px] flex justify-start items-start  ">
                <div className=" cursor-pointer relative flex w-[50px]  h-[100%] justify-center items-center  rounded-full ">
                  <img
                    className=" hover:brightness-75  rounded-full object-cover w-full h-full "
                    src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
                    alt=""
                    srcSet=""
                  />
                </div>
                <div className=" relative px-2  w-[80%] font-[600] flex flex-col tracking-wide text-[15px] justify-start items-start ">
                  <p>Kaung Myat Soe</p>
                  <div
                    onClick={() => setPrivacy(!privacy)}
                    className="  cursor-pointer hover:brightness-[120%] flex justify-center gap-1 items-center p-1 rounded w-auto h-[25px] bg-[#212121] "
                  >
                    <div className="  flex justify-center items-center  ">
                      <img className="  w-[14px] flex   " src={icon} alt="" />
                    </div>
                    <div className=" tracking-wide font-normal text-[12px] flex flex-col justify-center items-center ">
                      {option}
                    </div>
  
                    <div className=" flex justify-center items-center ">
                      <img
                        style={{
                          rotate: privacy === true ? "180deg" : "0deg",
                        }}
                        className=" w-[16px] h-[16px] "
                        src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FArrowDown.svg?alt=media&token=9c43da96-a4d0-4894-bc09-54ea459ee604"
                        alt=""
                      />
                    </div>
                  </div>
                  <div
                    id="privacy_option"
                    style={{
                      height: privacy === true ? "85px" : "0",
                      visibility: privacy === true ? "visible" : "hidden",
                      bottom: privacy === true ? "-190%" : "0%",
                    }}
                    className=" z-[999] tracking-wide font-normal text-[12px] flex flex-col justify-start items-start  absolute w-auto bg-[#212121] px-2 rounded py-1 "
                  >
                    {privacyData?.map((data) => {
                      return (
                        <div
                          style={{
                            opacity: privacy === true ? "1" : "0",
                          }}
                          onClick={() => {
                            setOption(data.option);
                            setPrivacy(!privacy);
                            setIcon(data.icon);
                          }}
                          key={data.id}
                          className=" px-1 justify-between items-center gap-1 rounded py-1 cursor-pointer hover:bg-[#333333] flex hover:brightness-125 "
                        >
                          <img
                            className=" h-[14px] w-[14px] flex   "
                            src={data.icon}
                            alt=""
                          />
                          <p> {data.option} </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => dispatch(setShowStory({ showStory: false }))}
              id="closeCreatePost"
              className=" hover:-rotate-90 h-[40px] cursor-pointer relative rounded-full bg-[#212121] flex justify-center items-center w-[40px] "
            >
              <div className=" absolute rotate-45  w-[2px] h-[45%] rounded-full bg-[#e4e6ebb5] "></div>
              <div className=" absolute rotate-45  w-[45%] h-[2px] rounded-full bg-[#e4e6ebb5] "></div>
            </div>
          </div>
          <div className=" relative flex h-[75%] overflow-y-auto max-h-[75%] flex-col outline-none p-0 justify-between items-center w-full ">
            
  
            <div className=" self-end h-[75%] flex w-full bg-[#111111]  rounded  ">
              <div className="flex items-center justify-center w-full">
                <label
                  for="dropzone-file"
                  className="flex flex-col items-center justify-center w-[80%] h-[80%] border-2 border-[#343536] border-dashed rounded-lg cursor-pointer bg-[#212121] "
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Photo / Video{" "}
                    </p>
                    <input  onChange={(e)=> setImgSrc(e.target.files[0])}  id="dropzone-file" type="file" className="" />

                  </div>
                </label>
              </div>
            </div>

            {
              imgSrc && <div className=" flex justify-center items-center p-1 rounded " >
                <img src={imgSrc} alt="" />
              </div>
            }

            <div className=" flex justify-end items-center w-full h-[50px] p-1 " >
                  <div onClick={CreateNewStory} className=" rounded justify-center items-center bg-[#0866ff] cursor-pointer px-4 py-1 " >
Submit
                  </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreateStory
