import { blurOn, setArea } from "../redux/services/animateSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useChangeChildrenVisibility from "./ChangeChildrenVisibility";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { setUpdateFeed } from "../redux/services/authSlice";
import checkFileType from "../redux/services/Hooks/CheckFileType";
import { doc, setDoc } from "firebase/firestore";
import Icon from "@mdi/react";
import { mdiPlusBoxMultipleOutline } from "@mdi/js";
const CreatePostBox = () => {
  const [option, setOption] = useState("Public");
  const [icon, setIcon] = useState(
    "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FPublic.png?alt=media&token=e3945f3a-c97e-41f0-b44e-a7027f23df34"
  );
  const [isImage, setIsImage] = useState(true);

  const [PID, setPID] = useState("0");
  const [imfurlForUp, setImgUrlUp] = useState([]);
  const[isUploading,setIsUploading] = useState(false)

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
  const Create_post = ["Create_post"];
  const { blur, isDeskTop } = useSelector((state) => state.animateSlice);
  const { admin, adminProfile, userAvatar, updateFeed } = useSelector(
    (state) => state.authSlice
  );

  useEffect(() => {
    blur === false
      ? useChangeChildrenVisibility(Create_post, "hidden")
      : useChangeChildrenVisibility(Create_post, "visible");
  }, [blur, privacy]);

  useEffect(() => {
    dispatch(
      setArea({
        width: window.outerWidth,
        height: window.outerHeight,
      })
    );
  }, []);

  const [detail, setDetail] = useState("");

  const name = admin?.user_name?.stringValue;

  const UID = admin?.UID?.stringValue;

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

  const nick =
    firstCharacters.length > 0
      ? firstCharacters?.reduce((prev, curr) => prev + curr)
      : null;

  const uploadPost = async (file, fileSize, PID, filePath) => {
    setIsUploading(true)
    const storageRef = file && ref(storage, filePath); // Replace with your desired file path

    file &&
      (await uploadBytes(storageRef, file)
        .then((data) => {
          console.log(data);

          getDownloadURL(data.ref).then((downloadURL) => {
            setImgUrlUp([
              ...imfurlForUp,
              { downloadURL: downloadURL, fileSize: fileSize },
            ]);
            setIsUploading(false)
          });
        })
        .catch((error) => console.log(error)));
  };

  const CreateNewPost = async (e) => {
    let FileType;
    let FileSize;
    const file = e.target.files[0];

    const fileSize = e.target.files[0]?.size;

    const filePath = `user_post/${UID}/${PID}/${file.name}`;

    const fileType = checkFileType(file);

    FileType = fileType;

    fileType ? (FileSize = fileSize) : null;

    fileType
      ? uploadPost(file, fileSize, PID, filePath).then((data) =>
          console.log(data)
        )
      : alert("Your file type doesn't allow to post", fileType);
  };

  async function addUserPost() {
    const userPostRef = doc(firestore, "USER_POSTS", `/${PID}/`);

    const PostData = {
      PID,
      UPLOADED_AT: Date.now(),
      POST_OWNER_DETAIL: {
        POID: admin?.UID.stringValue,
        PON: admin?.user_name.stringValue,
      },
      POST_DETAIL: {
        POST_CAPTION: detail.length > 0 ? detail : false,
        POST_IMAGE_PATH: imfurlForUp,
        LIKES: [
          {
            LOID: "0A",
            LON: "BOT",
          },
        ],
        SHARES: [
          {
            SOID: "0A",
            SON: "BOT",
          },
        ],
        COMMENTS: [
          {
            COID: "0A",
            CON: "BOT",
            COMMENTS_DETAIL: {
              COT: "FIRST COMMENT!",
              REPLYS: [
                {
                  RPOID: "1A",
                  RPON: "BOT_01",
                  RPOT: "FIRST REPLY",
                },
                {
                  RPOID: admin?.UID.stringValue,
                  RPON: admin?.user_name.stringValue,
                  RPOT: "REPLIED BY OWNER",
                },
                {
                  RPOID: "2A",
                  RPON: "BOT_02",
                  RPOT: "SECOND REPLY",
                },
              ],
            },
          },
        ],
      },
    };

    await setDoc(userPostRef, PostData)
      .then((data) => {
        dispatch(setUpdateFeed(!updateFeed));
        setImgUrlUp([]);
        setDetail("");
        dispatch(blurOn({ blur: false }));
      })
      .catch((error) => console.log(error));
  }

  return (
    <div
      id="Create_post"
      style={{
        visibility: blur === true ? "visible" : "hidden",
        width: !isDeskTop ? "95%" : "50%",
      }}
      className=" text-[#d4d4d4] p-2 Create_post flex flex-col justify-between items-center rounded-md bg-[#18191a]  h-[90%] overflow-y-auto max-h-[90%] "
    >
      <div
        style={{
          width: blur === true ? "100%" : "100%",
          height: blur === true ? "100%" : "0%",
        }}
        className=" flex flex-col justify-start items-start "
      >
        <div className=" flex w-full h-[20%] justify-between items-start ">
          <div className=" w-[80%] h-auto p-2  flex flex-col justify-start items-center  rounded-md ">
            <div className=" w-full h-[50px] flex justify-start items-start  ">
              <div className=" cursor-pointer relative flex w-[50px]  h-[100%] justify-center items-center  rounded-full ">
                <img
                  className=" invert-none hover:brightness-75  rounded-full object-cover w-full h-full "
                  src={adminProfile?.length > 10 ? adminProfile : userAvatar}
                  alt=""
                  srcSet=""
                />
              </div>
              <div className=" relative px-2  w-[80%] font-[600] flex flex-col tracking-wide text-[15px] justify-start items-start ">
                <p>{name}</p>
                <div
                  onClick={() => setPrivacy(!privacy)}
                  className="  cursor-pointer hover:brightness-[120%] flex justify-center gap-1 items-center p-1 rounded w-auto h-[25px] bg-[#212121] "
                >
                  <div className="  flex justify-center items-center  ">
                    <img className=" invert-none  w-[14px] flex   " src={icon} alt="" />
                  </div>
                  <div className=" tracking-wide font-normal text-[12px] flex flex-col justify-center items-center ">
                    {option}
                  </div>

                  <div className=" flex justify-center items-center ">
                    <img
                      style={{
                        rotate: privacy === true ? "180deg" : "0deg",
                      }}
                      className=" invert-none w-[16px] h-[16px] "
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
                          className=" invert-none h-[14px] w-[14px] flex   "
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
            onClick={() => dispatch(blurOn({ blur: false }))}
            id="closeCreatePost"
            className=" hover:-rotate-90 h-[40px] cursor-pointer relative rounded-full bg-[#212121] flex justify-center items-center w-[40px] "
          >
            <div className=" absolute rotate-45  w-[2px] h-[45%] rounded-full bg-[#e4e6ebb5] "></div>
            <div className=" absolute rotate-45  w-[45%] h-[2px] rounded-full bg-[#e4e6ebb5] "></div>
          </div>
        </div>
        <div className=" relative  flex h-[80%] overflow-y-auto min-h-[80%] flex-col outline-none p-0 justify-between items-center w-full ">
          <div className="  h-auto flex flex-col gap-0 justify-start items-start w-full ">
            <textarea
              id="myInput"
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  setDetail((prevDetail) => prevDetail + " \n ");
                } else {
                  setDetail(e.target.value);
                }
              }}
              onChange={(e) => {
                setDetail(e.target.value);
              }}
              placeholder="What's on your mind?"
              value={detail}
              className="border-l-2 bg-[#11111175]    rounded-r relative outline-none p-2 w-full min-h-[50px] cursor-text text-[24px] break-words whitespace-pre-wrap user-select-[text]"
              spellCheck="true"
              autoFocus
            />
          </div>

          <div className=" relative flex-col h-[85%] p-2 overflow-y-auto max-h-[75%] flex-wrap outline-none p-0 justify-center items-center w-[60%] ">
            { isUploading ?   <div className=" flex justify-center bg-[#242424] w-full h-[90%] items-center p-1 rounded ">
             
             </div> :
            imfurlForUp?.length > 0 &&
              imfurlForUp.reverse().map((d) => {
                return (
                  <div className=" flex  justify-start w-[100%] flex-col  flex-wrap-reverse h-auto items-start p-1 rounded ">
                    {isImage ? (
                      <img
                        className=" invert-none rounded  h-[70%] object-cover "
                        src={d.downloadURL}
                        alt=""
                      />
                    ) : (
                      <video
                        className=" invert-none  h-auto w-auto object-cover "
                        src={d.downloadURL}
                        alt=""
                      />
                    )}
                  </div>
                );
              })}
            {imfurlForUp.length < 11 && (
              <div className=" cursor-pointer justify-center self-center items-center  h-[50px]   flex w-full bg-[#11111157]  rounded-lg  ">
                <div className="flex cursor-pointer self-center items-center justify-center  h-full w-full">
                  <label
                    for="dropzone-file"
                    className="flex flex-col items-center   justify-center w-auto h-[100%] border-2 border-[#343536] border-dashed rounded-lg cursor-pointer bg-[#212121] "
                  >
                    <div className="flex h-full w-[50px] flex-col cursor-pointer relative items-center justify-center  ">
                      <Icon path={mdiPlusBoxMultipleOutline} size={10} />
                      <input
                        onClick={() => setPID(UID + "_" + Date.now())}
                        onChange={CreateNewPost}
                        id="dropzone-file"
                        type="file"
                        className=" absolute cursor-pointer w-full opacity-0 h-full "
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className=" sticky-bottom    flex justify-end    items-center  h-[50px] p-1 ">
            <div
              onClick={addUserPost}
              className=" rounded justify-center items-center bg-[#0866ff] cursor-pointer px-4 py-1 "
            >
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBox;
