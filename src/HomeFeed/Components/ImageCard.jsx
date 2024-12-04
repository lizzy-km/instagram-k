import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const ImageCard = ({PID,url }) => {

  


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
      size
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    const {  isMobile } = useSelector(
        (state) => state.animateSlice
      );
  return (
    <div className=" w-full h-full "  >
      <img
      src={url}
      key={PID+"_"+url}
      id="imgW"
      style={{
        width: isMobile ? '100%' :'100%'
      }}
      className=" invert-none cursor-pointer h-full   bg-[#242526] rounded-xl   snap-center transition-all   object-cover object-top  "
      alt=""
      srcset=""
    />
    </div>
    
  );
};

export default ImageCard;
