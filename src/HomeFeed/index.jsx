import Story from "./Components/Story";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";

const HomeFeed = () => {
  return (
    <div className=" relative h-screen flex overflow-y-auto  pt-3 w-[40%] gap-3 flex-col justify-around items-start max-h-screen ">
      <Story />
      <section className=" absolute top-[270px] h-auto w-[100%] flex flex-col justify-center items-center ">
        <CreatePost />
        <Post />
        <section className=" w-full h-[200px] flex p-2 " >
        
      </section>
      </section>
      
    </div>
  );
};

export default HomeFeed;
