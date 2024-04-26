import React from 'react'
import { useGetPlaylistDataQuery } from '../redux/api/TvApi';

const Watch = () => {

  const data = useGetPlaylistDataQuery();

  console.log(data);


  return (
    <div className=' flex w-[50%] h-screen justify-center items-center ' >Watch</div>
  )
}

export default Watch