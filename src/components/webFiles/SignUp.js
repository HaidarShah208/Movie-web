import React, { useState,useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {getAuth,RecaptchaVerifier,signInWithPhoneNumber} from "firebase/auth";
import app from "../firebase/Config";
import swal from 'sweetalert'
import bcrypt from 'bcryptjs'
import { addDoc } from "firebase/firestore";
import { userRef } from "../firebase/Config";
import { useNavigate } from "react-router-dom";
import Toastify from 'toastify-js'
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


const auth = getAuth(app);
function SignUp() {
  const navigate = useNavigate();
  //const useAppstate = useContext(Appstate);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
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

  // captcha varifier
  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth,"recaptcha-container",{
        size: "invisible",
        callback: (response) => {

        },
      },
      auth
    );
  };

  //request otp
  const requestOtp = () => {
      if(!form.name || !form.password || !form.mobile){
          notificationAlert("please enter all fields", "error")
          return
        }
    setLoading(true);
    generateRecaptha();
    let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, `+92${form.mobile}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      }).catch((error) => {
        console.log(error)
      })
 }

    //varify OTP
    const verifyOTP = () => {
      if(!OTP){
        notificationAlert("please enter OTP", "error")
        return
      }
        try {
          setLoading(true);
          window.confirmationResult.confirm(OTP).then((result) => {
            uploadData();
            swal({
              text: "Sucessfully Registered",
              icon: "success",
              buttons: false,
              timer: 3000,
            });
            navigate('/login')
            setLoading(false); 
          })
        } catch (error) {
          console.log(error);
        }
      }

      const uploadData=async()=>{
   try{
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(form.password, salt); // for encript password

    localStorage.setItem("user_name", form.name);
    localStorage.setItem("user_mobile", form.mobile);
    localStorage.setItem("user_password", form.password);

  await addDoc(userRef,{
    name:form.name,
    password:form.password,
    mobile:form.mobile,
     
  })
   }catch(error){
    console.log(error)
   }
    }


     
  return (
    <div className="w-full text-start flex flex-col mt-8 items-center">
      {otpSent ? (
        <>
          <h1 className="text-xl text-white font-bold">Sign Up</h1>
          <div class="p-2 sm:w-1/2 md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                OTP
              </label>
              <input
                id="message"
                name="message"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          <div class="p-2 w-full flex items-center justify-center">
            <button  onClick={verifyOTP} class="flex mx-auto  text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
              {loading ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl text-white font-bold">Sign Up</h1>
          <div class="p-2 sm:w-1/2 md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                name
              </label>
              <input
                id="message"
                name="message"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
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
            <button onClick={requestOtp} class="flex mx-auto  text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
              {loading ? <TailSpin height={25} color="white" /> : "Request OTP"}
            </button>
          </div>
        </>
      )}
      <div className="mt-5">
        <p className="text-white">
          Already have an account?{" "}
          <Link to={"/login"}>
            <span className="text-blue-500">Login</span>
          </Link>
        </p>
      </div>
      <div id='recaptcha-container'></div>
    </div>
  );
}

export default SignUp;
