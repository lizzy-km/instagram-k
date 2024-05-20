import React, { useState } from "react";
import shadesOf from "tailwind-shades";

const ColorShades = () => {
  const colorCode = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const [colorInput, setColorInput] = useState("#2563eb");

  const shades = shadesOf(colorInput);
  return (
    <div className=" w-[100%] border border-[#333333] p-2 flex gap-6 flex-col justify-between items-start  rounded-md ">
      <div className=" flex  gap-2 justify-between items-center ">
        
        {colorCode.map((colorCodes) => {
          return (
            <div onClick={() => setColorInput(shades[colorCodes])}
              key={colorCodes}
              style={{
                backgroundColor: shades[colorCodes],
              }}
              className=" cursor-pointer flex p-5 "
            ></div>
          );
        })}
      </div>

      <div className=" flex gap-2 w-[100%]  items-center">
        <label
          for="hs-color-input"
          class="block text-sm font-medium mb-2 dark:text-white"
        >
          Choose Main Color -
        </label>
        <input
          onChange={(e) => setColorInput(e.target.value)}
          type="color"
          class="p-1 h-10 w-[5rem] block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
          id="hs-color-input"
          value={colorInput}
          title="Choose your color"
        />

        <input
          onChange={(e) => setColorInput(e.target.value)}
          type="text"
          class="p-1 h-10 w-[6rem] block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
          id="hs-color-input"
          value={colorInput}
          title="Choose your color"
        />
      </div>
    </div>
  );
};

export default ColorShades;
