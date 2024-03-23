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
import { blurOn } from "./redux/services/animateSlice";

function App() {
  const isAuth = useSelector((state) => state.authSlice.isLogin);

  const blur = useSelector((state) => state.animateSlice.blur);

  const dispatch = useDispatch();
  const blurOff = () => {
    dispatch(blurOn({ blur: false }));
  };

  return (
    <section className=" bg-[#18191a] w-full flex flex-col justify-start items-center h-screen ">
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

      <section
        onClick={blurOff}
        style={{
          visibility: blur === true ? "visible" : "hidden",
        }}
        className=" bg-[#21212134] flex w-full h-screen backdrop-blur-md absolute top-[0%] z-[99] justify-center items-center "
      ></section>
    </section>
  );
}

export default App;
