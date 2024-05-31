import React, { useState } from "react";

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
  return (
    <img
      src={imageUrl}
      key={data}
      id="imgW"
      className=" cursor-pointer  bg-[#242526]  snap-center transition-all  w-full object-cover object-top  "
      alt=""
      srcset=""
    />
  );
};

export default ImageCard;
