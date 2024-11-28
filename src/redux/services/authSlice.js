import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  token: null,
  viewImage: null,
  viewStoryImage: null,
  isLogin: true,
  element: null,
  UserData: [],
  Post: [],
  Story: [],
  admin: [],
  adminProfile: [],
  hasNewStory: false,
  storyId: 0,
  userId: 0,
  userAvatar:
    "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2Fe8d7d05f392d9c2cf0285ce928fb9f4a.jpeg?alt=media&token=43dffced-a38e-40cf-9387-6a7071e40baa",
  userData: [],
  AdminData: [],
  Post: [],
  sharePost: [],
  savePost: [],
  imageList: [],
  changesSTID: [],
  updateFeed: true,
  // friend:[]
};

const STORAGE_KEY = "Auth";

// Serialize the state
const serializedState = JSON.stringify(initialState);

// Deserialize the state
const deserializedState = JSON.parse(serializedState);

//____________________________________________________storedItems_____________________Null_____//
const storedItems = Cookies.get(STORAGE_KEY)
  ? JSON.parse(Cookies.get(STORAGE_KEY))
  : null;

if (storedItems) {
  deserializedState.isLogin = storedItems;
}

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  deserializedState,
  reducers: {
    addUser: (deserializedState, { payload }) => {
      (deserializedState.user = payload.user),
        (deserializedState.token = payload.token);
      Cookies.set(STORAGE_KEY, JSON.stringify(deserializedState.user));
      Cookies.set("token", JSON.stringify(deserializedState.token));
    },
    addViewImage: (deserializedState, { payload }) => {
      deserializedState.viewImage = payload;
    },
    addStoryImage: (deserializedState, { payload }) => {
      deserializedState.viewStoryImage = payload;
    },
    setLogin: (deserializedState, { payload }) => {
      deserializedState.isLogin = payload;
      Cookies.set(STORAGE_KEY, JSON.stringify(deserializedState.isLogin));
    },
    addElement: (deserializedState, { payload }) => {
      deserializedState.element = payload;
    },
    addUserData: (deserializedState, { payload }) => {
      deserializedState.UserData = payload;
    },
    addPost: (deserializedState, { payload }) => {
      deserializedState.Post = payload;
    },
    addStory: (deserializedState, { payload }) => {
      deserializedState.Story = payload;
    },
    addAdmin: (deserializedState, { payload }) => {
      deserializedState.admin = payload;
    },
    addAdminProfile: (deserializedState, { payload }) => {
      deserializedState.adminProfile = payload;
    },

    setNotHasNewStory: (deserializedState, { payload }) => {
      deserializedState.hasNewStory = false;
    },
    setHasNewStory: (deserializedState, { payload }) => {
      deserializedState.hasNewStory = true;

      setTimeout(setNotHasNewStory(), 700);
    },
    setStoryId: (deserializedState, { payload }) => {
      deserializedState.storyId = payload;
    },
    setUserId: (deserializedState, { payload }) => {
      deserializedState.userId = payload;
    },
    setImageList: (deserializedState, { payload }) => {
      deserializedState.imageList = [...deserializedState.imageList, payload];
    },
    setChangesSTID: (deserializedState, { payload }) => {
      deserializedState.changesSTID = payload;
    },
    setUpdateFeed: (deserializedState, { payload }) => {
      deserializedState.updateFeed = payload;
    },
  },
});

export const {
  updateFeed,
  setUpdateFeed,
  setChangesSTID,
  changesSTID,
  imageList,
  setImageList,
  userId,
  setUserId,
  storyId,
  setStoryId,
  setNotHasNewStory,
  addUser,
  addFriend,
  addViewImage,
  addStoryImage,
  setLogin,
  addElement,
  element,
  addUserData,
  UserData,
  addPost,
  Post,
  addStory,
  Story,
  addAdmin,
  admin,
  addAdminProfile,
  adminProfile,
  setHasNewStory,
  hasNewStory,
} = authSlice.actions;
export default authSlice.reducer;
