import {
    CollectionReference,
    Firestore,
    addDoc,
    collection,
    collectionGroup,
    doc,
    getDocs,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import { firestore } from "../../../firebase/firebase";
const UpdateData = async(colName='story',username='',Data) => {
    function getFirstChars() {
        if (!username) return []; // Handle empty string case
    
        const words = username.split(" ");
        const firstChars = [];
        for (const word of words) {
          firstChars.push(word[0]);
        }
        return firstChars;
      }
    
      const firstCharacters = getFirstChars();
    
      let nick;
    
      for (let i = 0; i < firstCharacters.length; i++) {
        nick = firstCharacters.reduce((prev, curr) => prev + curr);
      }
    
      const name = username;
      const email = 'uemail';
      const bio = "It's me " + name;
      const UID = username.replace(/ /g, "_") + "Official";
      const shortName = nick;
      const nickName = "tyui";
      const date = new Date().getUTCMilliseconds();
    
    
      
      // Add a new document in collection "cities" with ID 'LA'
      const collectionRef = collection(firestore, 'story');
      const postRef = collection(firestore, 'user_posts');
      const userRef = doc(firestore, '/users' , `/${UID}/`);
      const udRef = doc(firestore, 'users' ,`${UID}`);
    
      if (colName === "user_posts") await updateDoc(userRef, {
            "post":[
                Data
            ]
        }).catch((error) => console.log(error));
    
    
    if (colName === "story") await updateDoc(userRef, {
            "story" :[
              Data
              ]
                  
           }).then((data)=>console.log(data)).catch((error) => console.log(error)); 
    
     
        
      
    
    
}

export default UpdateData
