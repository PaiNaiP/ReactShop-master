import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { collection, where, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { query, deleteDoc } from 'firebase/firestore';
import { db } from '../config/config';
import '../styles/Update.css'
import brawl from '../img/Goodies - Awesome.png'
import { async } from '@firebase/util';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/config';


export const UpdateProduct = () => {
  const {id} = useParams();
  let navigate = useNavigate();
  const [progress, setProgress]=useState(0 )
  const [price, setPrice] = useState([])
  const [description, setDescription] = useState([])
  const [title, setTitle] = useState([])
  const [url, setUrl] = useState([])
  const [jd, setJd] = useState([])
  const [quantity, setQuantity] = useState([])
  const cities = [];
  const handleInformationOfProduct = async()=>{
      const q = query(collection(db, "products"), where("title", "==", id));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
       setPrice(doc.data().price)
       setDescription(doc.data().description)
       setTitle(doc.data().title)
       setUrl(doc.data().url)
       setJd(doc.id)
  });
  
});
  }

  handleInformationOfProduct()


  const handletoSave = async() =>{
    
    const tit = document.getElementById('title')
    const des = document.getElementById('description')
    const pr = document.getElementById('price')
    const washingtonRef = doc(db, "products", jd);
    let a = 'true'
    const q = query(collection(db, "products"), where("title", "==", tit.value));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      a = 'false'
    });
    if(tit.value!=''){
      if(a==='true'){
        await updateDoc(washingtonRef, {
        title:tit.value
        });
      }
      else{
        alert('Такое название уже есть')
      }
    }
    if(des.value!=''){
      await updateDoc(washingtonRef, {
      description:des.value
      });
    }
    if(pr.value!=''){
      await updateDoc(washingtonRef, {
      price:pr.value
      });
  }
  navigate('/')
  }

  const updateImage = async(url)=>{
    const washingtonRef = doc(db, "products", jd);
    await updateDoc(washingtonRef, {
      url:url
});
  }

  const handleProductImg = async(e)=>{
    const selectedFile = e.target.files[0];
    if(selectedFile!==null){
   // setImage(selectedFile)
    const images = ref(storage, `/files/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(images, selectedFile)
    uploadTask.on("state_changed", (snapshot)=>{
        const prog = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
        setProgress(prog)
        console.log(progress)
    },(err)=> console.log(err),
    ()=>{
        getDownloadURL(uploadTask.snapshot.ref)
        .then(url=>{
          updateImage(url)
  })
})
}
  }

const handleDelete = async()=>{
  await deleteDoc(doc(db, "products", jd)).then(()=>{
    navigate('/')
  });

}
  return (
    <>
      <div className="cont-update">
        <div className="cont-input-update">
          <div className="inp-cont-up">
            <input type="text" id='title' placeholder={title} className='inputupdate'/>
          </div>
          <div className="inp-cont-up">
            <input type="text" id='description' placeholder={description} className='inputupdate'/>
          </div>
          <div className="inp-cont-up">
            <input type="text" id='price' placeholder={price} className='inputupdate'/>
          </div>
          <div className="inp-cont-up">
            <input onChange={handleProductImg} type="file" id='photo' placeholder={url} className='inputupdate'/>
          </div>
          <div className="save-but" onClick={handletoSave}>Save</div>
          <div className="Delete" onClick={handleDelete}>Delete</div>
          <Link to='/' style={{ textDecoration: 'none'}}>
          <div className="Cancel">Cancel</div>
          </Link>
        </div>
      <img src={brawl} alt="" className="brawl" />
      </div>
    </>
  )
}
