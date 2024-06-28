import React from 'react';
import LoadingGif from '../images/Loading.gif';
import '../css/Loader.css'

const Loader = () => {
  return (
   <div className="loader">
    <div className="loader__image">
        <img src={LoadingGif} alt="Loading ..." />
    </div>
   </div>
  )
}

export default Loader