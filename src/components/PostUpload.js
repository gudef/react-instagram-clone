import React from 'react'
import { useState } from 'react'
import {storage} from '../firebase/firebase'
import { doc, addDoc, collection } from "firebase/firestore";
import {db} from '../firebase/firebase'
import { serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import '../css/PostUpload.css'

const PostUpload = ({username, uid, anonymously}) => {
    
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);

    const chooseFile = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
        
    }
    console.log(file);
    console.log(caption);
  
    const uploadFile = (e) => {
        e.preventDefault()
        const imageName = file.name;
        const randomImageName = imageName + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

       console.log("kuy");

        const addPost = (caption, username, url) => {

            //console.log(url);

                  
            addDoc(collection(db, "posts"), {
                
                timestamp: serverTimestamp(),
                caption: caption,
                username: username,
                imageURL: url

              });

           
        }



        const storageRef  = ref(storage, `files/${randomImageName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on("state_changed",
          (snapshot) => {
            const progressTemp =
              Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progressTemp);
          },
          (error) => {
            alert(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             
                //console.log(downloadURL);
                if(anonymously == true)
                {
                  let userTemp = uid.substr(0, 5);
                  addPost(caption,userTemp,downloadURL);
                }
                else{
                  addPost(caption,username,downloadURL);
                }
            });
          }
        );

    }

    return (
    <div>
        <form>
        <input id="fileinput" style={{ marginTop: "30px" }} className="child" type="file" name="upload-file" onChange={chooseFile}  />
        <progress className="child" max={100} value={progress} />
        <input className="child" type="text" name="upload-caption" placeholder="write your caption here" 
    value={caption} onChange={(e) => setCaption(e.target.value)} />
        <button onClick={uploadFile}>Submit</button>
        </form>
    </div>
  )
}

export default PostUpload