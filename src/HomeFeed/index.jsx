import { useDispatch, useSelector } from "react-redux";
import LeftNav from "../Components/LeftNav";
import RightNav from "../Components/RightNav";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";
import Story from "./Components/Story";
import GetAdminData from "../redux/services/Hooks/GetAdminData";
import { useEffect } from "react";
import { addAdmin } from "../redux/services/authSlice";

const HomeFeed = () => {
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  const  dispatch = useDispatch()

  const { admin } = useSelector(
    (state) => state.authSlice
  );

  const userId = localStorage.getItem('adminId')

  const getAdmin = [GetAdminData("users", userId)];

  useEffect(()=> {
    Promise.all(getAdmin)
              .then((data) =>
                dispatch(addAdmin(data[0][0]))
            )
              .catch((error) => console.log(error))

  },[])

console.log(admin);
 
  return (
    <div
      style={{
        width: isMobile
          ? "100%"
          : isTablet
          ? "95%"
          : isDeskTop
          ? "40%"
          : "100%",
      }}
      className=" relative h-screen flex  overflow-y-auto  pt-3 w-[40%] gap-3 flex-col justify-center items-center max-h-screen "
    >
      <Story />
      <div
        style={{
          width: isMobile
            ? "100%"
            : isTablet
            ? "90%"
            : isDeskTop
            ? "100%"
            : "100%",
        }}
        className=" absolute w-full top-[270px] flex flex-col gap-6 "
      >
        <CreatePost />
        <Post />
      </div>
    </div>
  );
};

export default HomeFeed;
