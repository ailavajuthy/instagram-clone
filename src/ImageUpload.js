import React , {useState} from 'react'
import Button from '@mui/material/Button';
import { db } from "./firebase";
import firebase from "firebase/compat/app";
import './ImageUpload.css'

function ImageUpload({username}) {
    const [caption, setCaption]=useState('');
    const [image, setImage]=useState(null);
    const [progress, setProgress]=useState(0);

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload=()=>{
        if (!image) {
        alert("Please select an image first.");
        return;
    }
        const reader=new FileReader();
        reader.readAsDataURL(image);
        reader.onloadstart=()=>setProgress(10);
        reader.onprogress=(e)=>{
            if(e.lengthComputable){
                setProgress(Math.round((e.loaded/e.total)*80));
            }
        };

        reader.onload=()=>{
            const base64Image=reader.result;
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption:caption,
                imageURL: base64Image,
                username: username

            })
            .then(()=>{
                setProgress(100);
                setTimeout(()=>setProgress(0),1000);
                setCaption("");
                setImage(null);
            })
            .catch((error)=>{
                console.error("Error uploading post: ", error);
                alert(error.message);
            });
        };
        reader.onerror=(error)=>{
            console.error("FileReader error: ", error);
            alert("Failed to read image file");
        };
    }

  return (
    <div className="imageupload">
      <progress className="imageupload__progress"value={progress} max="100"/>
      <input type="text" placeholder="Enter a caption..." onChange={event=>setCaption(event.target.value)} value={caption}/>
      <input type="file" accept="image/*" onChange={handleChange}/>
      <Button onClick={handleUpload}>
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload