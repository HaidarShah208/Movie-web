import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import ReactStars from 'react-rating-stars-component'
import { useParams } from 'react-router-dom'
import { db } from '../firebase/Config';
import { ThreeCircles} from 'react-loader-spinner';
import Reviews from './Reviews';


function Details() {
    const {id}=useParams();
    const [loading,setLoading]=useState(false)
    
    const [data,setData]=useState({
        title:'',
        year:'',
        image:'',
        description:'',
        rating:0,
        rated:0
    })

    useEffect(()=>{
        async function getData() {
            setLoading(true)
            const _doc = doc(db, 'movie', id);
            const _data = await getDoc(_doc);
          
            if (_data.exists()) {
              setData(_data.data());
            }
            setLoading(false)

        }
        getData();
    },[])
  return (
    <div className='text-white p-4 w-full flex flex-col md:flex-row justify-center'>
        {loading? <div className='flex items-center justify-center h-80'><ThreeCircles  color="white" width='70'/></div> :
  <>
  <img src={data.image} className='h-96 block md:sticky top-24' alt="nothing" />
   
   <div className="ml-0 md:ml-4 w-full md:w-1/2 text-start">
    <h2 className='text-3xl mt-3 md:mt-0 font-bold'>{data.title} <span>{data.year}</span></h2>
    <ReactStars size={20} edit={false} value={5} half={true}/>
    <h1 className='mt-3 '>
        <p className='pt-4'>{data.description}</p></h1>
        <Reviews id={id} prevRating={data.rating} userRated={data.rated}/>
   </div>
  </>
}
    </div>
  )
}

export default Details