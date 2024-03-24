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
import { blurOn, setArea } from "./redux/services/animateSlice";
import CreatePostBox from "./Components/CreatePostBox";

function App() {
  const isAuth = useSelector((state) => state.authSlice.isLogin);

  const { width, height, blur } = useSelector((state) => state.animateSlice);

  return (
    <section className=" bg-[#18191a] w-full flex flex-col justify-start items-center h-screen ">
      <section
        style={{
          width: blur === true ? width : "0%",
          height: blur === true ? height : "0%",
        }}
        className="  flex justify-center items-center z-[9999999] absolute bottom-[0%] bg-[#2121211a] backdrop-brightness-50   "
      >
        <CreatePostBox />
      </section>
      <BrowserRouter>
        <NavBar />
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
