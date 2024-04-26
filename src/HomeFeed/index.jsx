import Story from "./Components/Story";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";
import VideoPlayer from "./VideoPlayer";

const HomeFeed = () => {
  return (
    <div className=" main  ">
      <Story />
      <section className=" post ">
        <CreatePost />
        <Post />
        <section className=" postFooter  "></section>
      </section>
    </div>
  );
};

export default HomeFeed;
