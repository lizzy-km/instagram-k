import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogin } from "../redux/services/authSlice";
import { collection, doc, getDocs,updateDoc } from "firebase/firestore";
import { getStorage, getDownloadURL,ref,listAll } from "firebase/storage"

import { app, firestore, storage } from "../firebase/firebase";

const Login = () => {
  
  const isAuth = useSelector((state) => state.authSlice.isLogin);
  const [loginState, setLoginState] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState({
    email: "incorrect email address*",
    password: "incorrect password*",
    IsErrorEmail: false,
    IsErrorPassword: true,
  });
  const admin = {
    email: "admin@gmail.com",
    password: "admin0000",
  };
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confrimPassword: "",
  });

  const { UserData } = useSelector((state) => state.authSlice);

  const user = UserData[0]?.filter(
    (d) =>
      d.email.stringValue === userData.email &&
      d.password.stringValue === userData.password
  )[0];

  const [docId, setDocId] = useState("");

  const get = async () => {

    const collectionRef = await getDocs(collection(firestore,'users'))




    for (let i = 0; i < collectionRef.docs.length; i++) {
      if (
        collectionRef.docs[i]._document.data.value.mapValue.fields.email
          .stringValue === userData.email &&
        collectionRef.docs[i]._document.data.value.mapValue.fields.password
          .stringValue === userData.password
      ) {
        setDocId(collectionRef.docs[i].id);
      }
    }
  };

  useEffect(() => {
    get();
  }, []);

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // addData()

    const email = userData.email
    const password = userData.password

    firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(user) {
    console.log('User registered successfully!',user);
  })
  .catch(function(error) {
    console.log('Error registering user:', error);
  });
    

    const collectionRef = doc(firestore,'users',docId);
    const storageRef = ref(storage,'user_photo/dev.lizzy/profile_image/KMPP00');


    
    // const not = await listAll(storageRef)

    const dataToUpdate = {
      isLogin:true
    }
    
    // const res = await updateDoc(collectionRef,dataToUpdate)
    // console.log(res);
    // console.log(not);

    setError({
      ...error,
      IsErrorEmail: userData.email !== admin.email ? true : false,
    });
    setError({
      ...error,
      IsErrorPassword: userData.password !== admin.password ? true : false,
    });

    !userData.email || !userData.password
      ? alert("Please fill all the fields!")
      : userData.email === admin.email && userData.password === admin.password
      ? dispatch(setLogin(true))
      : dispatch(setLogin(false));
  };

  return (
    <div className=" flex flex-col justify-center items-center w-full h-screen ">
      <div className="flex w-full justify-center items-center h-screen bg-transparent">
        <div className="w-full max-w-md p-4 bg-[#212121] rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">
            {loginState === false
              ? "Sign up with Facebook"
              : "Login with Facebook"}
          </h1>
          <form onSubmit={handleSubmit}>
            {loginState === false && (
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Username
                </label>
                <input
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              {error.IsErrorEmail === true && (
                <span className=" flex p-2  italic text-red-600 ">
                  {" "}
                  {error?.email}{" "}
                </span>
              )}

              <input
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              {error.IsErrorPassword === true && (
                <span className=" flex p-2  italic text-red-600 ">
                  {" "}
                  {error?.password}{" "}
                </span>
              )}

              <input
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                type="password"
                id="password"
                className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            {loginState === false && (
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  value={userData.confrimPassword}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      confrimPassword: e.target.value,
                    })
                  }
                  type="password"
                  id="confrimPassword"
                  className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-between mb-4"></div>

            <button
              type="submit"
              className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loginState === false
                ? "Signup with Facebook"
                : "Login with Facebook"}
            </button>
          </form>
          <div className="text-center flex justify-center mt-4">
            <span className="text-sm text-gray-200">
              {!loginState
                ? "Already have an account?"
                : "You don't have any account?"}
            </span>
            {loginState === true ? (
              <div
                onClick={() => setLoginState(false)}
                className="text-sm cursor-pointer text-blue-600 hover:underline ml-1"
              >
                Sign up
              </div>
            ) : (
              <div
                onClick={() => setLoginState(true)}
                className="text-sm cursor-pointer text-blue-600 hover:underline ml-1"
              >
                Login
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
