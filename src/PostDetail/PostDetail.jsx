import React from 'react'
import { useParams } from 'react-router-dom'

const PostDetail = () => {

    const {uid,pid} = useParams()


  return (
    <div className=' flex pt-[100px] w-full h-screen justify-center items-center ' >
     {uid}'s {" "} Post Detail
    </div>
  )
}

export default PostDetail
