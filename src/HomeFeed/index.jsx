import { useSelector } from "react-redux";
import LeftNav from "../Components/LeftNav";
import RightNav from "../Components/RightNav";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";
import Story from "./Components/Story";

const HomeFeed = () => {
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

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
