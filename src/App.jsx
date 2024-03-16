import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeFeed from "./HomeFeed";
import UserProfile from "./UserProfile";
import OtherProfile from "./OtherProfile";
import Login from "./Auth/Login";
import { useSelector } from "react-redux";

function App() {
  const isAuth = useSelector(state => state.authSlice.isLogin);


  return (
    <section>
      <BrowserRouter>
        {isAuth === true ? (
          <Routes>
            <Route exact path="/*" element={<HomeFeed />} />
            <Route path="/:user" element={<UserProfile />} />
            <Route path="/profile/:username" element={<OtherProfile />} />
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
