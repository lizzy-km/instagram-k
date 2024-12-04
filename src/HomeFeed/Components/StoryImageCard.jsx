import { useSelector } from "react-redux";
const StoryImageCard = ({ PID, url }) => {
    console.log(url);
    
  function getImageSize(imageLink) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        const imageSize = {
          width: this.width,
          height: this.height,
        };
        resolve(imageSize);
      };
      img.onerror = function () {
        reject(new Error("Failed to load image"));
      };
      img.src = imageLink;
    });
  }

  // Usage example
  const imageUrl = url;
  getImageSize(imageUrl)
    .then((size) => {
      size;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const { isMobile } = useSelector((state) => state.animateSlice);
  return (
    <div  className=" relative min-w-full w-full flex justify-center items-center py-0 px-2  h-full ">
        <img className=" invert absolute top-0 left-0 w-[150%] h-[150%] blur " src={url} alt="" srcset="" />
      <img
        src={url}
        key={PID + "_" + url}
        id="imgW"
        style={{
          width: isMobile ? "100%" : "100%",
        }}
        className=" invert-none cursor-pointer h-full  min-w-full  bg-[#24252657]    snap-center transition-all   object-cover object-top  "
        alt=""
        srcset=""
      />
    </div>
  );
};

export default StoryImageCard;
