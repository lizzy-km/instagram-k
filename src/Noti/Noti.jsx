import { addDoc, collection, orderBy, query } from 'firebase/firestore';
import React from 'react'
import { auth, firestore } from '../firebase/firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const Noti = () => {
  const messagesRf = collection(firestore, "NOTIFICATION");
  const quer = query(messagesRf, orderBy("createdAt"));

  const [NOTIFICATION] = useCollectionData(quer, { idField: "id" });

  const { uid } = auth.currentUser;
  console.log(NOTIFICATION);

  const addNewNoti = async (text, target,NewNotiData) => {
    await addDoc(messagesRf, {
      text: 'text',
      createdAt: Date.now(),
      uid,
      target: 'target',
      type:'post',
      detail: [
        {
          postID: 'PostData?.id',
          postText:'PostData?.text',
          postImage:'PostData?.image',
          postTime: 'PostData?.createdAt'  
        }
      ]
    });
  };  
  

  return (
    <div className=' flex flex-col w-full h-full justify-start items-start  gap-1   ' >
      {/* <div>
        <button onClick={() => addNewNoti('text', 'target', 'PostData')} >Add Noti</button>
      </div>
      Noti */}
      {
        NOTIFICATION?.map((data) => {
          return (
            <div key={data.id} className='flex justify-start w-full h-[60px]  bg-[#212121] p-2 tracking-wider items-start'>
              <p>{data.text}</p>
            </div>
          )   })
      }
    </div>
  )
}

export default Noti
