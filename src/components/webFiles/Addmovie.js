import React, { useContext, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import {addDoc} from 'firebase/firestore'
import swal from 'sweetalert'
import { useNavigate } from 'react-router-dom';
import { movieRef } from '../firebase/Config';
import { Appstate } from '../../App';
import Toastify from 'toastify-js'


function Addmovie() {
  const navigate=useNavigate()
    const [loading,setLoading]=useState(false)
    const appstate=useContext(Appstate)
    const [form,setForm]=useState({
        title:'',
        year:'',
        image:'',
        description:'',})
   
      
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

    //add movie
  const addMovies=async()=>{
    if(!form.title || !form.year || !form.image || !form.description){
      notificationAlert("please fill all fields", "error")
      return
    }
    try{
      setLoading(true)
      await addDoc(movieRef,form)
    swal({
      title:'Successfully Added',
      icon:'success',
      duration:1000,
      buttons:false
    })
    setLoading(false)
    navigate('/')
    }catch(error){
      swal({
        title:'invalid credentials',
        icon:'error',
        duration:3000,
        buttons:false
      })
      console.log(error)
    }
  }
  
  
  
  
  
    return (
    <div className='text-white'>
        <section className="text-gray-600 body-font relative">
  <div className="container px-5 py-8 mx-auto">
    <div className="flex flex-col text-center w-full mb-4">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Add new movie</h1>
    </div>
    <div className="text-start lg:w-1/2 md:w-2/3 mx-auto">
      <div className="flex flex-wrap -m-2">
        <div className="p-2 w-1/2">
          <div className="relative">
            <label for="name" className="leading-7 text-lg text-white">Title</label>
            <input type="text" id="name" name="name"  value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-white font-medium  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label for="email" className="leading-7 text-lg text-white">Year</label>
            <input type="number" id="email" name="email" value={form.year} onChange={(e) => setForm({...form, year: e.target.value})} className="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-full">
          <div className="relative">
            <label for="email" className="leading-7 text-lg text-white">Image Link</label>
            <input type="text" id="message" name="message" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-full">
          <div className="relative">
            <label for="message" className="leading-7 text-lg text-white">Description</label>
            <textarea id="message" name="message"   value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-black py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
          </div>
        </div>
        <div className="p-2 w-full">
          <button className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-700 rounded text-lg" onClick={addMovies}>{loading?<TailSpin height={25} color='white' />: 'Submit'}</button>
        </div>
       
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Addmovie