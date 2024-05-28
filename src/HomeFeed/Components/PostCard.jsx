import { getDownloadURL, listAll, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { storage } from '../../firebase/firebase';
const PostCard = ({name,data}) => {

    const [userProfile,setUserProfile] = useState()
    const [storyImgs, setStoryImgs] = useState();

  const imgUrl = async () => {
    const urls = await getDownloadURL(ref(storage, storyImgs));
    setUserProfile(urls);
  };

  const storageRef = ref(
    storage,
    `user_photo/${data?.UID?.stringValue}/${data?.profile_picture.arrayValue.values[0].mapValue.fields.PFID?.stringValue}`
  );

  const list = async () => {
    const not = await listAll(storageRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
      setStoryImgs(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    list();
  }, []);

  useEffect(() => {
    imgUrl();
  }, [storyImgs]);


  return (
    <section  className=' flex flex-col p-2 gap-2 rounded-md bg-[#212121] w-full ' >  
            <div className=' w-full h-[50px] p-1 flex justify-between items-center ' >
              <div className=' w-auto h-fulll flex justify-start items-start ' >
                <div className=' rounded-full  bg-[#333333] ' >
                    <img className=' w-[40px] p-1 h-[40px] rounded-full object-cover cursor-pointer ' src={userProfile} alt="" srcset="" />
                </div>
                <div className=' cursor-pointer px-2 py-1 w-auto justify-start items-start text-sm h-full ' >
                    <p>
                      {
                        name
                      }
                    </p>
                </div>
              </div>
            </div>
          </section>
  )
}

export default PostCard
