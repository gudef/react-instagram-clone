import React from 'react'
import '../css/Post.css'
import CommentBox from './CommentBox'
import Comments from './Comments'
import { useState, useEffect } from 'react'

const Post = ({ postID, user, username, caption, imageURL,uid, anonymously }) => {
  
    const [newComment, setNewComment] = useState({});

    return (

        <div className="post">
            <div className="post__header">
                <h4 className="post__username">{username}</h4>
            </div>
            <img className="post__image" src={imageURL} alt={username} />
            <h4 className="post__caption"><strong>{username}</strong> : {caption}</h4>
            <Comments postID={postID} newComment={newComment} />
            <CommentBox user={user} postID={postID} uid={uid} anonymously={anonymously} setNewComment={setNewComment} />
        </div>
        
  )
}

export default Post