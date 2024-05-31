import React, { useState } from "react";
import { useSelector } from "react-redux";

const ImageCard = ({ data }) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [full, setFull] = useState(false);

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
  const imageUrl = data;
  getImageSize(imageUrl)
    .then((size) => {
      setHeight(size?.height);
      setWidth(size?.width);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    const { isTablet, isMobile, isDeskTop } = useSelector(
        (state) => state.animateSlice
      );
  return (
    <img
      src={imageUrl}
      key={data}
      id="imgW"
      style={{
        width: isMobile ? '100%' :'100%'
      }}
      className=" cursor-pointer  bg-[#242526]   snap-center transition-all   object-cover object-top  "
      alt=""
      srcset=""
    />
  );
};

export default ImageCard;
