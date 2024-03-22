import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeFeed from "./HomeFeed";
import UserProfile from "./UserProfile";
import OtherProfile from "./OtherProfile";
import Login from "./Auth/Login";
import { useSelector } from "react-redux";
import NavBar from "./Components/NavBar";
import { useLazyEnvironmentQuery } from "./redux/api/AuthApi";
import Group from "./Group/Group";
import Game from "./Game/Game";
import Watch from "./Watch/Watch";

function App() {
  const isAuth = useSelector((state) => state.authSlice.isLogin);

  const env = useLazyEnvironmentQuery();
  console.table(isAuth);

  

  return (
    <section  className=" bg-[#18191a] w-full flex flex-col justify-start items-center h-screen ">
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
