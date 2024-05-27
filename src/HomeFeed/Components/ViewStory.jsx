import React, { useEffect, useState } from "react";
import StoryCard from "./StoryCard";
import { useDispatch, useSelector } from "react-redux";
import GetData from "../../redux/services/Hooks/useGetData";
import { addStory } from "../../redux/services/authSlice";
import OtherStoryCard from "./OtherStoryCard";
import addData from "../../redux/services/Hooks/AddData";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { setShowStory } from "../../redux/services/animateSlice";
const ViewStory = () => {
    const [plus, setPlus] = useState(false);
    const { UserData, Story, admin, adminProfile } = useSelector(
      (state) => state.authSlice
    );
    const dispatch = useDispatch();
  
  
  
    const createStory = () => {
      setPlus(!plus);
      dispatch(setShowStory(true));
    };
  
    const userData = UserData;
  
    const user = userData
      ?.filter((d) => d?._document.data.value.mapValue.fields.story?.arrayValue.values[0]?.mapValue.fields.STID.stringValue?.length >0 )
  
    const userStory = admin.story.arrayValue.values?.map(
      (d) => d.mapValue.fields
    );
  
    const otherStory = userData?.filter(
      (d) => d._document.data.value.mapValue.fields.UID.stringValue !== admin.UID.stringValue
    );
  
    const getData = async () => {
      const data = await getDocs(collection(firestore, "story"));
  
      const doc = data.docs;
  
      dispatch(addStory(doc));
    };
  
    useEffect(() => {
      getData();
    }, []);
  
    const pf = admin?.profile_picture?.arrayValue.values.filter(
      (d) => d?.mapValue.fields
    )[0]; // Check this profile picture is currently use
  
    const [translateX, setTranslateX] = useState(0);
  
    const otherHasStory = otherStory.filter(d => d._document.data.value.mapValue.fields.story.arrayValue.values[0]?.mapValue.fields.STID.stringValue?.length > 0 )


    const storyCard = document.getElementById('story_id')
    const storyWidth = storyCard?.clientWidth
    const translateStoryCard = () => {
      ((user.length+1) * 150) - storyWidth >= translateX
        ? setTranslateX(translateX + (user?.length * 150) / (storyWidth/150).toFixed(0))
        : setTranslateX(0);
    };
  
    const { isTablet, isMobile, isDeskTop } = useSelector(
      (state) => state.animateSlice
    );
  return (
    <div className=' flex justify-center items-center p-2 w-full h-full ' >
      View Story
    </div>
  )
}

export default ViewStory
