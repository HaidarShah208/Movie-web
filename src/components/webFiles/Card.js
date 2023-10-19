import React, { useEffect, useState } from 'react';
import { InfinitySpin } from 'react-loader-spinner';
import ReactStars from 'react-rating-stars-component'
import { getDocs } from 'firebase/firestore';
import { movieRef } from '../firebase/Config';
import { Link } from 'react-router-dom';


function Card() {
    const [loading,setLoading]=useState(false)
    const [data,setData]=useState([]);

    useEffect(() => {
        // Check if data is empty before fetching
        if (data.length === 0) {
          async function getData() {
            setLoading(true)
            const _data = await getDocs(movieRef);
            const newData = [];
            _data.forEach((doc) => {
              newData.push({ ...(doc.data()), id: doc.id });
            });
            setData(newData);
            setLoading(false);
          }
          getData();
        }
      }, [data]); // Add data as a dependency to avoid re-fetching when data changes
      
     
  return (
    <div className='p-3 flex flex-wrap justify-start mt-2'>
        {loading? <div className='w-full flex justify-center items-center h-80'><InfinitySpin color='white' /></div> :
     data.map((e,i)=>{
     return(
      <Link to={`/details/${e.id}`}>
      <div
        key={i}
        className="card text-sm md:text-lg text-start font-medium p-2 rounded shadow-lg hover:scale-105 cursor-pointer mt-6 transform transition-transform duration-500 bg-slate-900 ms-2"
      >
        <img className="h-30 md:h-72" src={e.image} alt="" />
        <div className="card-body text-white">
          <h1>Name: {e.title}</h1>
          <h1 className="flex items-center">
            <span className="me-2">Rating:</span>
            <ReactStars size={20} edit={false} value={5} half={true} />
          </h1>
          <h1>Year: {e.year}</h1>
        </div>
      </div>
    </Link>
    
     )
     })}
    </div>
  );
}

export default Card;
