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

function App() {
  const isAuth = useSelector((state) => state.authSlice.isLogin);

  const { width, height, blur, isTablet, isMobile, isDeskTop,showStory } = useSelector(
    (state) => state.animateSlice
  );

  let ScreenSize = window.innerWidth;

  const dispatch = useDispatch();

  window.addEventListener("resize", () => {
    ResponsiveFun()

  });

  function  ResponsiveFun () { 
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

  useEffect(()=> {
    ResponsiveFun()
  },[])



  function DeleteRounded () {
  }


  return (
    <section className=" bg-[#18191a] overflow-hidden w-full flex flex-col justify-start items-center h-screen ">
      <section
        style={{
          width: blur === true ? '100%' : "0%",
          height: blur === true ? '100vh' : "0%",
        }}
        className= {`flex items-[${isMobile ? 'start':'center'}] py-3 overflow-hidden justify-center z-[9999999] absolute bottom-[0%] bg-[#2121211a] backdrop-brightness-50 `}  
      >
        <CreatePostBox />
      </section>
      <section
        style={{
          width: showStory === true ? '100%' : "0%",
          height: showStory === true ? '100vh' : "0%",
        }}
        className={`flex items-[${isMobile ? 'start':'center'}] py-3 overflow-hidden justify-center z-[9999999] absolute bottom-[0%] bg-[#2121211a] backdrop-brightness-50 `}  
      >
        <CreateStory/>
      </section>
      <BrowserRouter>
        {isAuth === true && <NavBar />}
        {isAuth === true ? (
          <Routes>
            <Route exact path="/*" element={<HomeFeed />} />
            <Route exact path="/game" element={<Game />} />
            <Route exact path="/watch" element={<Watch />} />
            <Route exact path="/group" element={<Group />} />

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
