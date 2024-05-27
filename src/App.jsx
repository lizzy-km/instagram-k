import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeFeed from "./HomeFeed";
import UserProfile from "./UserProfile";
import OtherProfile from "./OtherProfile";
import Login from "./Auth/Login";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./Components/NavBar";
import Group from "./Group/Group";
import Game from "./Game/Game";
import Watch from "./Watch/Watch";
import { useEffect } from "react";
import {
  blurOn,
  setArea,
  setDesktop,
  setMobile,
  setTablet,
} from "./redux/services/animateSlice";
import CreatePostBox from "./Components/CreatePostBox";
import CreateStory from "./Components/CreateStory";
import GetAdminData from "./redux/services/Hooks/GetAdminData";
import { addAdmin, addAdminProfile } from "./redux/services/authSlice";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "./firebase/firebase";
import Loading from "./Loading/Loading";
import ViewStory from "./HomeFeed/Components/ViewStory";

function App() {
  const isAuth = useSelector((state) => state.authSlice.isLogin);

  const { width, height, blur, isTablet, isMobile, isDeskTop, showStory } =
    useSelector((state) => state.animateSlice);

  let ScreenSize = window.innerWidth;

  const dispatch = useDispatch();

  window.addEventListener("resize", () => {
    ResponsiveFun();
  });

  function ResponsiveFun() {
    ScreenSize = window.innerWidth;

    if (ScreenSize < 600) {
      dispatch(setMobile());
    }

    if (ScreenSize > 600 && ScreenSize < 1150) {
      dispatch(setTablet());
    }
    if (ScreenSize > 1150) {
      dispatch(setDesktop());
    }
  }

  useEffect(() => {
    ResponsiveFun();
  }, []);

  useEffect(() => {
    ResponsiveFun();
  }, [window.innerWidth]);


  const getAdmin = [GetAdminData()];
  const { admin,hasNewStory } = useSelector((state) => state.authSlice);


  useEffect(() => {
    Promise.all(getAdmin)
      .then((data) => {
        dispatch(addAdmin(data[0]));
        getAdminProfileImage();
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const getAdmin = [GetAdminData()];

    Promise.all(getAdmin)
      .then((data) => {
        dispatch(addAdmin(data[0]));
        getAdminProfileImage();
      })
      .catch((error) => console.log(error));

  }, [hasNewStory]);

  async function getAdminProfileImage() {

    const userActivePf = admin?.profile_picture?.arrayValue?.values.filter(
      (d) => d.mapValue.fields
    )[0];
    const adminId = localStorage.getItem("adminId");

    const adminImgs = [];
    const storageRef = ref(
      storage,
      `user_photo/${adminId}/${userActivePf?.mapValue.fields.PFID?.stringValue}`
    );

    await listAll(storageRef).then((not) => {
      for (let ii = 0; ii < not?.items.length; ii++) {
        adminImgs.push(not.items[ii]?.fullPath);
      }
    });

    await getDownloadURL(ref(storage, adminImgs[0])).then((data) =>
      dispatch(addAdminProfile(data))
    );
  }

  useEffect(()=> {
    getAdminProfileImage()
  },[admin])

  return (
    <section className=" bg-[#18191a] overflow-hidden w-full flex flex-col justify-start items-center h-screen ">
    
      <BrowserRouter>
        {isAuth === true && <NavBar />}
        <section
        style={{
          width: blur === true ? "100%" : "0%",
          height: blur === true ? "100vh" : "0%",
          alignItems: isMobile ? "start" : "center",
        }}
        className={`flex i py-3 overflow-hidden justify-center z-[9999999] absolute bottom-[0%] bg-[#2121211a] backdrop-brightness-50 `}
      >
        <CreatePostBox />
      </section>
      <section
        style={{
          width: showStory === true ? "100%" : "0%",
          height: showStory === true ? "100vh" : "0%",
          alignItems: isMobile ? "start" : "center",
        }}
        className={`flex  py-3 overflow-hidden justify-center z-[9999999] absolute bottom-[0%] bg-[#2121211a] backdrop-brightness-50 `}
      >
        <CreateStory />
      </section>
      {/* <section className=' absolute flex justify-center items-center p-3 w-full z-[9999] h-full backdrop-blur backdrop-brightness-50 bg-[#21212152] ' >
          <ViewStory/>
      </section> */}
        {isAuth === true ? (
          <Routes>
              
            <Route exact path="/*" element={<HomeFeed />} />
            <Route exact path="/game" element={<Game />} />
            <Route exact path="/watch" element={<Watch />} />
            <Route exact path="/group" element={<Group />} />
            <Route exact path="/loading" element={<Loading />} />

            <Route path="/:user/" element={<UserProfile />} />
            <Route path="/profile/:username/" element={<OtherProfile />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/*" element={<Login />} />
          </Routes>
        )}
      </BrowserRouter>
    </section>
  );
}

export default App;
