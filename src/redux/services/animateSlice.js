import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  blur: false,
  noti: false,
  account: false,
  menu: false,
  messenger: false,
  width: null,
  height: null,
  isMobile: false,
  isTablet: false,
  isDeskTop: false,
  showStory: false,
  viewStory: false,
  addProfile: false,
  bottomNav: true,
  showChat:false,
  sentMsg:true,
  botNav:true,
  postLimit:5
};

const STORAGE_KEY = "Animate";

//____________________________________________________storedItems_____________________Null_____//
const storedItems = Cookies.get(STORAGE_KEY)
  ? JSON.parse(Cookies.get(STORAGE_KEY))
  : null;

if (storedItems) {
  initialState.blur = storedItems;
}

export const animateSlice = createSlice({
  name: "animateSlice",
  initialState,
  reducers: {
    blurOn: (state, { payload }) => {
      state.blur = payload.blur;
    },chatOn: (state, { payload }) => {
      state.showChat = payload;
    }
    ,sentMessage: (state, { payload }) => {
      state.sentMsg = payload;
    },
    setShowStory: (state, { payload }) => {
      state.showStory = payload;
    },
    setAddProfile: (state, { payload }) => {
      state.addProfile = payload;
    },
    accountSettingOn: (state, { payload }) => {
      state.account = payload.account;
      state.noti = false;
      state.messenger = false;
      state.menu = false;
    },
    notiOn: (state, { payload }) => {
      state.account = false;
      state.noti = payload.noti;
      state.messenger = false;
      state.menu = false;
    },
    messengerOn: (state, { payload }) => {
      state.messenger = payload.messenger;

      state.account = false;
      state.noti = false;
      state.menu = false;
    },
    menuOn: (state, { payload }) => {
      state.menu = payload.menu;

      state.account = false;
      state.noti = false;
      state.messenger = false;
    },
    setArea: (state, { payload }) => {
      state.width = payload.width;
      state.height = payload.height;
    },

    setMobile: (state, { payload }) => {
      state.isMobile = true;
      state.isTablet = false;
      state.isDeskTop = false;
    },
    setTablet: (state, { payload }) => {
      state.isMobile = false;
      state.isTablet = true;
      state.isDeskTop = false;
    },
    setDesktop: (state, { payload }) => {
      state.isMobile = false;
      state.isTablet = false;
      state.isDeskTop = true;
    },
    setViewStory: (state, { payload }) => {
      state.viewStory = payload;
    },
    setBottomNav: (state, { payload }) => {
      state.bottomNav = payload;
    },
    setPostLimit: (state, { payload }) => {
      state.postLimit = payload;
    },

  },
});

export const {
  setMobile,
  setTablet,
  setDesktop,
  blurOn,
  accountSettingOn,
  notiOn,
  messengerOn,
  menuOn,
  setArea,
  isDeskTop,
  isMobile,
  isTablet,
  setShowStory,
  showStory,
  viewStory,
  setViewStory,
  setAddProfile,
  addProfile,
  setBottomNav,
  bottomNav,
  chatOn,
  showChat,
  sentMsg,
  sentMessage,
  setPostLimit,
  postLimit
} = animateSlice.actions;
export default animateSlice.reducer;
