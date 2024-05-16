import React from 'react'
import { doc, addDoc, collection } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import styled from 'styled-components/macro'
import {db} from '../firebase/firebase'
import { useState } from 'react'


const Wrapper = styled.form`
    display: flex;
    align-items: center;
    border-top: 1px solid #cacaca;
`

const InputComment = styled.input`
    flex: 1;
    padding: 10px;
    border: none;
`

const InputButton = styled.button`
    flex: 0;
    border: none;
    color: #6082a3;
    padding: 10px;
    background-color: white;
`

const Propmt = styled.h4`
    text-align: center;
    padding: 10px;
    border-top: 1px solid #cacaca;
`




const CommentBox = ({ user, postID ,uid, anonymously, setNewComment}) => {
  
    const [comment, setComment] = useState("");
    const [username, setUsername] = useState(""); 

    const submitHandler = (event) => {
  

            // if(anonymously == true)
            // {
            //     setUsername(uid.substr(0, 5));
            // }
            // else{
            //     setUsername(user.displayName);    
            // }

            const newComment = {
                comment: comment,
                username: user.displayName,
                timestamp: serverTimestamp()
            }
            event.preventDefault();

            addDoc(collection(db, "posts", postID ,"comments"), {
                
            comment: comment,
            username: user.displayName,
            timestamp: serverTimestamp()

          });

          setComment("");
          setNewComment(newComment)
  
    }

    console.log("PostID = " + postID);
  
    return (
    <>
            {user ? 
                <Wrapper>
                    <InputComment
                        type="text"
                        placeholder="Add comment here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <InputButton onClick={submitHandler}>Submit</InputButton>
                </Wrapper>
                :
                <Propmt>Login to comment</Propmt>
            }

    </>
  )
}

export default CommentBox