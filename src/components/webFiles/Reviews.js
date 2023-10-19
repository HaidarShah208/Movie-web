import React, { useContext, useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { reviewsRef, db } from "../firebase/Config";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert"
import Toastify from 'toastify-js'
import {Appstate} from '../../App'
import {
  addDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Reviews({ id, prevRating, userRated }) {

  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [data, setData] = useState([]);
  const useAppstate=useContext(Appstate)
  const navigate=useNavigate()


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

  //send reviews
  const sendReviews = async () => {
    setLoading(true);
    if(!form){
      notificationAlert("please write review", "error")
      setLoading(false);
      return
    }

    try {
      if (useAppstate.login) {
        const reviewData = {
          movieid: id,
          name: useAppstate.userName,
          thought: form,
          rating: rating,
          timestamp: new Date().getTime(),
        };
        
        // Add the new review data to the beginning of the current data array
        setData([reviewData, ...data]);
        await addDoc(reviewsRef, reviewData);
        
        // Update the rating and rated count in the parent component if needed
        const ref = doc(db, "movies", id);
        await updateDoc(ref, {
          rating: prevRating + rating,
          rated: userRated + 1,
        });
        setForm("");
        setRating(0);
        notificationAlert("review sent", "success")
      } else {
        swal({
          title: "Error",
          icon: "error",
          duration: 3000,
          buttons: false,
        });
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    async function getData() {
      setReviewsLoading(true);
      let quer = query(reviewsRef, where("movieid", "==", id));
      const querySnapshot = await getDocs(quer);
      const newData = [];
      querySnapshot.forEach((doc) => {
        newData.push(doc.data());
      });
      setData(newData);
      setReviewsLoading(false);
    }
    getData();
  }, []);
  

  return (
    <div className="mt-4 w-full">
      <ReactStars
        size={30}
        half={true}
        value={rating}
        onChange={(rate) => setRating(rate)}
      />
      <input
        value={form}
        onChange={(e) => setForm(e.target.value)}
        type="text"
        placeholder="share your thought"
        className="w-full outline-none my-3 bg-white rounded text-black p-2"
      />
      <button className="bg-green-600 w-full p-2 rounded" onClick={sendReviews}>
        {loading ? (
          <div className="flex justify-center">
            <TailSpin height={30} color="white" />
          </div>
        ) : (
          "Share"
        )}
      </button>

      {reviewsLoading ? (
        <div className="mt-6 flex justify-center">
          <ThreeDots height={10} color="white" />
        </div>
      ) : (
        <div className="mt-4">
          {data.map((e, i) => {
            return (
              <div key={i} className="bg-  p-2 rounded border-b border-gray-800 mt-2">
                <div className="flex">
                  <p className="text-red-600 md:text-lg">{e.name}</p>
                  <h4 className="ms-3 text-sm flex items-center">
                   ({new Date(e.timestamp).toLocaleString()})
                  </h4>
                </div>
                <ReactStars size={15} edit={false} value={e.rating} />
                <p>{e.thought}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Reviews;
