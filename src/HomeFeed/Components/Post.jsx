import React from 'react'
import { useSelector } from 'react-redux';

const Post = () => {

  const { admin,adminProfile } = useSelector((state) => state.authSlice);


  return (
    <div className='flex w-full p-2 my-2 h-auto bg-[#242526] rounded-md' >
        
        <section className=' flex flex-col p-2 gap-2 rounded bg-[#212121] w-full ' >  
          <div className=' w-full h-[50px] p-1 flex justify-between items-center ' >
            <div className=' w-auto h-fulll flex justify-start items-start ' >
              <div className=' rounded-full  bg-[#333333] ' >
                  <img className=' w-[40px] p-1 h-[40px] rounded-full ' src={adminProfile} alt="" srcset="" />
              </div>
              <div className=' px-2 py-1 w-auto justify-start items-start text-sm h-full ' >
                  <p>
                    {
                      admin.user_name.stringValue
                    }
                  </p>
              </div>
            </div>
          </div>
        </section>

    </div>
  )
}

export default Post