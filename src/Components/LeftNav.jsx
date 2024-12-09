import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setIsSearch, setUpdateFeed } from "../redux/services/authSlice";
import { app, auth, db, firestore } from "../firebase/firebase";
import Icon from "@mdi/react";
import { mdiCloseCircleMultiple } from "@mdi/js";
import {
  collection,
  collectionGroup,
  CollectionReference,
  getDoc,
  getDocs,
  getFirestore,
  query,
  queryEqual,
  where,
} from "firebase/firestore";

const LeftNav = () => {
  const { isTablet, isMobile } = useSelector((state) => state.animateSlice);
  const { updateFeed, isSearch } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const dispatch = useDispatch();
  const user = auth?.currentUser?.uid;

  useEffect(() => {
    user && localStorage.setItem("adminId", user);
  }, []);

  const [searchValue, setValue] = useState("");
  const [searchText, setSearchText] = useState("");

  const getSearchData = async (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
    await getDocs(
      query(
        collection(firestore, "users"),
        where("user_name", "==", e.target.value)
      )
    ).then((data) => {
      setValue(data?.docs);
    });
  };


  return (
    <section
      style={{
        width: isMobile ? "100%" : isTablet ? "30%" : "30%",
        justifyContent: isMobile ? "end" : "start",
        padding: isMobile ? "8px" : "0",
      }}
      className={` ${
        isMobile && "flex-row-reverse"
      } flex w-[30%]  gap-2 items-center left_nav h-full`}
    >
      <NavLink
        onDoubleClick={() => {
          // window.location.reload(true)
          dispatch(setUpdateFeed(!updateFeed));
        }}
        to={"/"}
        className=" cursor-pointer flex rounded-full justify-center items-center "
      >
        <img
          className=" h-[40px]  w-[40px] object-cover "
          src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FLogo.svg?alt=media&token=e93a02de-9b36-48e1-a74c-cd7af8dea71a"
          alt=""
        />
      </NavLink>

      <div
        style={{
          width: isSearch ? "80%" : "40px",
          justifyContent: isSearch ? "space-between" : "start",
        }}
        className=" pr-2 relative transition-all bg-[#2d2d2d] outline-1 outline- px-1 flex h-[40px] w-[40px] rounded-full justify-start items-center "
      >
        <img
          onClick={() => dispatch(setIsSearch(true))}
          className=" cursor-pointer px-2 "
          src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FSearch.svg?alt=media&token=0cc98ba7-3d8f-4f48-ad1c-5aa326bd3201"
          alt=""
        />
        <input
          onChange={(e) => getSearchData(e)}
          value={searchText}
          placeholder="Search"
          style={{
            width: isSearch ? "80%" : "40px",
            visibility: isSearch ? "visible" : "hidden",
          }}
          className=" transition-all bg-[#2d2d2d] outline-none border-none tracking-wide --tw-ring-color-none   px-1 flex h-[40px] w-[40px]  justify-start items-center "
          type="text"
          name=""
          id=""
        />
        <Icon
          style={{
            visibility: isSearch ? "visible" : "hidden",
          }}
          onClick={() => {
            dispatch(setIsSearch(false));
            setSearchText("");
            setValue([]);
          }}
          className=" cursor-pointer opacity-50  "
          path={mdiCloseCircleMultiple}
          size={1}
        />
        <div
          style={{
            width: isSearch ? "90%" : "40px",
            visibility: isSearch ? "visible" : "hidden",
          }}
          className=" flex justify-start items-center flex-col px-2 py-3 absolute top-[120%] left-0 w-full min-h-[200px] bg-[#2d2d2d] rounded-xl   "
        >
          {searchValue?.length > 0 ? (
            searchValue?.map((sv) => {
              return (
                <NavLink
                  to={`/${sv?._document?.data?.value.mapValue.fields.UID?.stringValue}`}
                  className=" flex text-lg justify-start items-center p-2 rounded-lg hover-bg-[#333333] gap-2      w-[95%] h-[50px] "
                >
                  <div className=" bg-[#2d2d2d] p-1 w-[50px] h-[50px] rounded-full ">
                    <img
                      className=" invert-none w-[100%] h-[100%] object-cover rounded-full "
                      src={
                        sv?._document?.data.value.mapValue.fields.profile
                          .arrayValue.values[0].mapValue.fields.PFPATH
                          .stringValue
                      }
                      alt=""
                      srcset=""
                    />
                  </div>
                  <p>
                    {
                      sv?._document?.data.value.mapValue.fields.user_name
                        ?.stringValue
                    }
                  </p>
                </NavLink>
              );
            })
          ) : (
            <div className=" flex p-2 rounded-lg bg-[#333333] w-[95%] h-[40px] ">
              <h1>No search data.</h1>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeftNav;
