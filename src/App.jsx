import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import MidNAv from "./Components/MidNAv";
import "react-toastify/ReactToastify.min.css";

import { useEffect, useState } from "react";
import {
  sentMessage,
  setBottomNav,
  setDesktop,
  setMobile,
  setTablet,
  setPostLimit,
} from "./redux/services/animateSlice";
import CreatePostBox from "./Components/CreatePostBox";
import CreateStory from "./Components/CreateStory";
import GetAdminData from "./redux/services/Hooks/GetAdminData";
import { addAdmin, addAdminProfile } from "./redux/services/authSlice";
import Loading from "./Loading/Loading";
import ViewStory from "./HomeFeed/Components/ViewStory";
import Noti from "./Noti/Noti";
import PostDetail from "./PostDetail/PostDetail";
import { ToastContainer } from "react-toastify";
import AddProfileBox from "./Components/AddProfileBox";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import MessengerApp from "./Messenger/Messenger";
import Menu from "./Menu/Menu";
import UpdateData from "./redux/services/Hooks/UpdateData";

function App() {
  const isUserLog = useAuthState(auth);
  // const {user} = useAuthState(auth);

  const user = auth.currentUser;

  const uid = user ?  user.uid : ''

  const isAuth = isUserLog[0]?.accessToken?.length > 0 ? true : false;

  const dispatch = useDispatch();

  const {
    blur,
    isMobile,
    isDeskTop,
    showStory,
    viewStory,
    addProfile,
    bottomNav,
    sentMsg,
    postLimit,
  } = useSelector((state) => state.animateSlice);

  let ScreenSize = window?.innerWidth;

  window.addEventListener("resize", () => {
    ResponsiveFun();
  });

  function ResponsiveFun() {
    ScreenSize = window.innerWidth;

    if (ScreenSize < 770) {
      dispatch(setMobile());
    }

    if (ScreenSize > 770 && ScreenSize < 1150) {
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

  const { admin, hasNewStory, updateFeed, isLogin } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  useEffect(() => {
    dispatch(setBottomNav(true));

    const getAdmin = [GetAdminData()];

    Promise.all(getAdmin)
      .then((data) => {
        dispatch(addAdmin(data[0]));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const getAdmin = [GetAdminData()];

    Promise.all(getAdmin)
      .then((data) => {
        dispatch(addAdmin(data[0]));
      })
      .catch((error) => console.log(error));
  }, [updateFeed]);

  useEffect(() => {
    const userActivePf = admin?.profile?.arrayValue.values?.filter(
      (d) => d?.mapValue.fields
    )[0]?.mapValue.fields?.PFPATH?.stringValue;

    dispatch(addAdminProfile(userActivePf?.length > 15 ? userActivePf : ""));
  }, [admin]);

  const [botNav, setBotNav] = useState(true);

  useEffect(() => {
    dispatch(setBottomNav(botNav));
  }, [botNav]);

  let scrollTopNum = [];

  const page = document.getElementById("page");

  page?.addEventListener("scroll", () => {
    if (page.offsetHeight * (postLimit - 1) < page.scrollTop) {
      dispatch(setPostLimit(postLimit + 5));
    }
  });

  !isDeskTop &&
    page?.addEventListener("scroll", () => {
      scrollTopNum.length < 2
        ? scrollTopNum.push(page.scrollTop)
        : (scrollTopNum.shift(), scrollTopNum.push(page.scrollTop));

      for (let i = 0; i < scrollTopNum.length; i++) {
        const prev = scrollTopNum[i - 1];
        const curr = scrollTopNum[i];

        if (prev > curr && prev !== undefined) {
          setBotNav(true);
        }
        if (prev < curr && prev !== undefined) {
          setBotNav(false);
        }
      }
    });

  // Function to set a cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Expiry date
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  }

  // Function to get a cookie by name
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const [key, value] = cookies[i].split("=");
      if (key === name) {
        return value;
      }
    }
    return null;
  }

  // Track user online/offline status
  async function trackUserStatus() {
    const isOnline = navigator.onLine; // Check if the user is online
    const status = isOnline ? "online" : "offline";
    
    setCookie(uid, status, 1); // Save status in cookie for 1 day
     UpdateData("status", uid, "pid", status, "")
  }

  // Initial check
  useEffect(() => {
    trackUserStatus();
  }, []);

  


  

  return (
    <section
      id="page"
      className="    bg-main relative snap-mandatory overflow-hidden min-h-screen max-h-screen  w-full flex flex-col justify-start items-start h-screen "
    >
      <div className=" absolute right-0 max-h-[70px] h-[70px] top-0 ">
        <ToastContainer autoClose={1000} />
      </div>

      <BrowserRouter>
        {isAuth === true && isLogin && <NavBar />}
        {blur === true && (
          <section
            style={{
              width: blur === true ? "100%" : "0%",
              height: blur === true ? "100vh" : "0%",
              alignItems: isMobile ? "start" : "center",
            }}
            className={`flex i py-[2rem] overflow-hidden justify-center z-[99]   fixed bottom-[0%] bg-[#2121211a] backdrop-brightness-50 `}
          >
            <CreatePostBox />
          </section>
        )}
        {showStory === true && (
          <section
            style={{
              width: showStory === true ? "100%" : "0%",
              height: showStory === true ? "100vh" : "0%",
              alignItems: isMobile ? "start" : "center",
            }}
            className={`flex  py-10 overflow-hidden justify-center z-[99] fixed top-[0%] bg-[#2121211a] backdrop-brightness-50 `}
          >
            <CreateStory />
          </section>
        )}
        {addProfile === true && (
          <section
            style={{
              width: addProfile === true ? "100%" : "0%",
              height: addProfile === true ? "100vh" : "0%",
              alignItems: isMobile ? "start" : "center",
            }}
            className={`flex  py-10 overflow-hidden justify-center z-[9999999] fixed top-[0%] bg-[#2121211a] backdrop-brightness-50 `}
          >
            <AddProfileBox />
          </section>
        )}
        {viewStory && (
          <section
            style={{
              display: viewStory ? "flex" : "none",
            }}
            className={`fixed flex justify-center items-center ${
              isDeskTop && "p-2"
            } w-full z-[9999] h-full backdrop-blur backdrop-brightness-50 bg-[#21212152] `}
          >
            <ViewStory />
          </section>
        )}

        <section
          id="page"
          className=" w-full snap-center  fixed top-0 left-0  h-screen max-h-screen overflow-auto    backdrop-blur-md bg-[#181818] items-start flex justify-center "
        >
          {isAuth === true && isLogin ? (
            <Routes>
              <Route exact path="/*" element={<HomeFeed />} />
              <Route exact path="/game" element={<Game />} />
              <Route exact path="/gallery" element={<Watch />} />
              <Route exact path="/group" element={<Group />} />
              <Route exact path="/loading" element={<Loading />} />
              <Route exact path="/message/:id" element={<MessengerApp />} />
              <Route exact path="/notification" element={<Noti />} />
              <Route exact path="/menu" element={<Menu />} />

              <Route path="/:user/" element={<UserProfile />} />
              <Route path="/profile/:username/" element={<OtherProfile />} />
              <Route path="/:uid/post_detail/:pid" element={<PostDetail />} />
            </Routes>
          ) : (
            <Routes>
              <Route exact path="/*" element={<Login />} />
            </Routes>
          )}
        </section>
        {isAuth === true && isLogin && !isDeskTop && (
          <section
            style={{
              bottom: bottomNav ? "8%" : 10,
              visibility: bottomNav ? "visible" : "collapse",
            }}
            className=" transition-all fixed  flex w-full h-10 justify-center items-center  "
          >
            <MidNAv />
          </section>
        )}
      </BrowserRouter>
    </section>
  );
}

export default App;
