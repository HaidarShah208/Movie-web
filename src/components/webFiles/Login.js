import React,{useContext, useState,useEffect} from 'react'
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import {query, where, getDocs} from 'firebase/firestore'
import { userRef } from "../firebase/Config";
import { Appstate } from "../../App";
import bcrypt from 'bcryptjs'
import swal from "sweetalert";
import Toastify from 'toastify-js'
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


function Login() {
    const navigate = useNavigate();
    const useAppstate = useContext(Appstate);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const [form, setForm] = useState({
      mobile: "",
      password: ""
    });
  
    const notificationAlert = (msg, type) => {
      let bgcolor;
      switch (type) {
          case "success":
              bgcolor = "linear-gradient(to right ,#EAD867,#37CF41)"
              break;
          case "error":
              bgcolor = "linear-gradient(to right , #D55D56,#DB2E1D)"
              break;
          case "default":
              bgcolor = "linear-gradient(to right ,#BA86B5,#CA16B8)"
      }
      Toastify({
          text: msg,
          duration: 1000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "left", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
              background: bgcolor,
          },
          onClick: function() {} // Callback after click
      }).showToast();
  }

    const login = async () => {
      if(!form.mobile || !form.password){
      notificationAlert("please fill all fields", "error")
      return
      }
        setLoading(true);
        try {
          const quer = query(userRef, where('mobile', '==', form.mobile))
          const querySnapshot = await getDocs(quer);
    
          querySnapshot.forEach((doc) => {
            const _data = doc.data();
            const isUser =(form.password, _data.password);
            if(isUser) {
              useAppstate.setLogin(true);
              useAppstate.setUserName(_data.name);

              
          localStorage.setItem("user_mobile", form.mobile);
          localStorage.setItem("user_password", form.password);
            }
            swal({
                title: "Loged In",
                icon: "success",
                buttons: false,
                timer: 3000
              })
              navigate('/')
          })
        } catch (error) {
          swal({
            title: error.message,
            icon: "error",
            buttons: false,
            timer: 3000
          })
        }
        setLoading(false);
      }

      useEffect(() => {
        // Retrieve user data from local storage when the component loads
        const storedMobile = localStorage.getItem("user_mobile");
        const storedPassword = localStorage.getItem("user_password");
    
        if (storedMobile && storedPassword) {
          setForm({
            ...form,
            mobile: storedMobile,
            password: storedPassword
            
          });
        }
      }, []);
    
  return (
    <div className="w-full text-start flex flex-col mt-8 items-center">
      <h1 className="text-xl text-white font-bold">Login</h1>
      <div class="p-2 sm:w-1/2 md:w-1/3">
        <div class="relative">
          <label for="message" class="leading-7 text-sm text-gray-300">
            Mobile No.
          </label>
          <input
            type={"number"}
            id="message"
            name="message"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div class="p-2 sm:w-1/2 md:w-1/3">
        <div class="relative">
          <label for="message" class="leading-7 text-sm text-gray-300">
            Password
          </label>
          <input
          type={passwordVisible ? 'text' : 'password'}
            id="message"
            name="message"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
              <div
            className="absolute top-8 right-3 cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
          >
            {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </div>
        </div>
      </div>
      <div class="p-2 w-full flex items-center justify-center">
        <button
         onClick={login}
          class="flex mx-auto  text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
        >
          {loading ? <TailSpin height={25} color="white" /> : "Login"}
        </button>
      </div>
      <div className='mt-5'>
        <p className='text-white'>Do not have account? <Link to={'/signup'}><span className="text-blue-500">Sign Up</span></Link></p>
      </div>
    </div>
  );
};

export default Login