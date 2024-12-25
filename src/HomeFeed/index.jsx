import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.authSlice);

  const getAdmin = [GetAdminData()];


  useEffect(() => {
    Promise.all(getAdmin)
      .then((data) => {
        dispatch(addAdmin(data[0]));
      })
      .catch((error) => console.log(error));
      document.title = "Queed | Newfeed"

  }, []);
  if (admin?.UID?.stringValue)
    return (
      <div
        style={{
          width: isMobile
            ? "100%"
            : isTablet
            ? "95%"
            : isDeskTop
            ? "35%"
            : "100%",
        }}
        className=" relative h-auto flex  bg-transparent mt-[80px]    p-0 w-[40%] gap-3 flex-col justify-start items-start  "
      >
        <Story />

        <div
          style={{
            width: isMobile
              ? "100%"
              : isTablet
              ? "90%"
              : isDeskTop
              ? "90%"
              : "90%",
          }}
          className="  w-[full]  items-center h-auto top-[270px] px-2 flex flex-col gap-6 "
        >
          <CreatePost />
          <Post />

          <div className=" w-full h-[60px] "></div>
        </div>
      </div>
    );
};

export default HomeFeed;
