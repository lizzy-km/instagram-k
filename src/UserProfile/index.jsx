import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CreatePost from "../HomeFeed/Components/CreatePost";
import Post from "../HomeFeed/Components/Post";
import Icon from "@mdi/react";
import { mdiSendVariantOutline } from "@mdi/js";
import { chatOn, messengerOn } from "../redux/services/animateSlice";
import { auth, firestore } from "../firebase/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import PostCard from "../HomeFeed/Components/PostCard";
import { useEffect } from "react";

const UserProfile = () => {
  const { userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const dispatch = useDispatch();

  const UID = useParams();

  const { uid } = auth.currentUser;

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  const userRf = collection(firestore, "USER_POSTS");
  const userQuery = query(userRf, orderBy("UPLOADED_AT", "desc"));
  const [TUser] = useCollectionData(userQuery, { idField: "id" });

  const userPfRf = collection(firestore, "users");
  const userPfQuery = query(userPfRf, where("UID", "==", UID.user));
  const [PUser] = useCollectionData(userPfQuery, { idField: "id" });

  const userPost = TUser?.filter(
    (tu) => tu.POST_OWNER_DETAIL.POID === UID.user
  );

  const userProfile = PUser?.length > 0 ? PUser[0]?.profile?.[0]?.PFPATH : "";
  const user = PUser?.length > 0 ? PUser[0] : [];

  useEffect(()=> {
    document.title = user?.user_name
  },[user?.user_name])

  const sendMessage = () => {
    dispatch(chatOn(false));
    localStorage.setItem("targetId", UID?.user);

    dispatch(
      messengerOn({
        messenger: true,
      })
    );
    dispatch(chatOn(true));
  };

  const bg =
    "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2F328652225_477950631031057_4570664772778110705_n%20(2).jpg?alt=media&token=ada5ce90-591d-47a6-88cb-07e80e9117d7";

  return (
    <section className=" flex flex-col items-center relative   bg-[#121212] w-full   h-screen max-h-screen overflow-y-auto overflow-x-hidden ">
      <section
        style={{
          height: !isDeskTop ? "30%" : "80%",
        }}
        className="  w-full absolute  top-0 flex flex-col justify- items-center bg-[#242526]  "
      >
        <div
          className={` absolute w-full h-[70%] top-0 blur-xl opacity-[0.3] brightness-45  `}
        >
          <img
            className=" invert-0 rounded-b-lg h-full w-full  object-cover "
            src={bg}
            alt=""
            srcset=""
          />
        </div>

        <div
          style={{
            width: !isDeskTop ? "100%" : "60%",
            height: !isDeskTop ? "100%" : "80%",
          }}
          className=" z-[100] relative flex flex-col  h-[50%] justify-start items-start   "
        >
          <img
            style={{
              height: !isDeskTop ? "80%" : "70%",
            }}
            className={` ${
              isDeskTop && "rounded-b"
            } " invert-none   w-full  object-cover "`}
            src={bg}
            alt=""
            srcset=""
          />
          <div
            style={{
              bottom: isMobile ? "2%" : "8%",
            }}
            className=" w-full h-auto absolute left-0 flex justify-between items-center "
          >
            <div className=" flex gap-2 justify-start items-center w-auto ">
              <div
                style={{
                  width: isMobile ? "60px" : "150px",
                  height: isMobile ? "60px" : "150px",
                }}
                className=" cursor-pointer p-1 bg-[#333333] rounded-full  "
              >
                <img
                  className=" invert-none rounded-full h-[100%] w-full  object-cover "
                  src={userProfile?.length > 10 ? userProfile : userAvatar}
                  alt=""
                  srcset=""
                />
              </div>

              <p
                style={{
                  fontSize: isMobile ? "0.8rem" : "2.2rem",
                }}
                className=" px-2 text-[2.2rem] bg-[#21212157] backdrop-blur rounded flex w-auto tracking-wide gap-2 font-medium "
              >
                {user?.user_name}{" "}
                {user?.nick_name && (
                  <p className=" font-thin ">({user.nick_name})</p>
                )}
              </p>
            </div>

            {uid !== UID?.user && (
              <div className=" flex gap-4 w-auto h-full  justify-end items-end p-1 ">
                <div
                  onClick={sendMessage}
                  className=" bg-[#121212] cursor-pointer hover:bg-[#181818] tracking-wide flex justify-center gap-1 items-center text-center w-auto px-2 rounded-md py-2 "
                >
                  <p className={` ${isMobile ? " text-sm " : ""} `}>
                    {" "}
                    Send Message
                  </p>{" "}
                  <Icon
                    path={mdiSendVariantOutline}
                    size={isMobile ? 0.7 : 1}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section
        style={{
          top: !isDeskTop ? "31%" : "81%",
          flexDirection: isMobile ? "column" : "row",
          width: !isDeskTop ? "100%" : "80%",
        }}
        className="   absolute h-auto flex justify-center items-center p-2 gap-4 "
      >
        {isDeskTop && (
          <div
            style={{
              width: !isDeskTop ? "100%" : "40%",
            }}
            className=" flex p-1 bg-[#333333]  h-screen rounded-md "
          ></div>
        )}

        <div
          style={{
            width: !isDeskTop ? "100%" : "45%",
          }}
          className={` ${
            !isDeskTop ? "px-0" : "px-4"
          } " flex flex-col gap-4    h-screen rounded-md " `}
        >
          <CreatePost position={"user"} />

          {userPost?.map((d) => {
            const data = d;
            const PID = data?.PID;
            const PON = data?.POST_OWNER_DETAIL.PON;

            return <PostCard data={data} name={PON} key={PID} />;
          })}
          <div className=" flex justify-center items-center w-full min-h-[70px] "></div>
        </div>
      </section>
    </section>
  );
};

export default UserProfile;
