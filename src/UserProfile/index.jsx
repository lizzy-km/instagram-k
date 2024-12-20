import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CreatePost from "../HomeFeed/Components/CreatePost";
import Post from "../HomeFeed/Components/Post";

const UserProfile = () => {
  const { userAvatar, UserData } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const UID = useParams();

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  const user = UserData?.find((d) => d.id === UID?.user)?._document.data.value
    .mapValue.fields;

  const userProfile =
    user?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue;

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
              bottom: !isDeskTop ? "2%" : "8%",
            }}
            className=" w-full h-auto absolute left-0 flex justify-start items-center "
          >
            <div
              style={{
                width: !isDeskTop ? "70px" : "150px",
                height: !isDeskTop ? "70px" : "150px",
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
                fontSize: !isDeskTop ? "1.1rem" : "2.2rem",
              }}
              className=" px-2 text-[2.2rem] flex w-auto tracking-wide gap-2 font-medium "
            >
              {user?.user_name?.stringValue}{" "}
              {user?.nick_name?.stringValue && (
                <p className=" font-thin ">({user.nick_name?.stringValue})</p>
              )}
            </p>
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
        { 
          isDeskTop && <div
          style={{
            width: !isDeskTop ? "100%" : "40%",
          }}
          className=" flex p-1 bg-[#333333]  h-screen rounded-md "
        ></div>
        }
        

        <div
          style={{
            width: !isDeskTop ? "100%" : "60%",
          }}
          className={` ${
            !isDeskTop ? "px-0" : "px-4"
          } " flex flex-col gap-4   w-[60%] h-screen rounded-md " `}
        >
          <CreatePost position={'user'} />

          <Post position={'user'} filter={UID?.user} />

          <div className=" flex justify-center items-center w-full min-h-[70px] " >
            
          </div>
        </div>
      </section>
    </section>
  );
};

export default UserProfile;
