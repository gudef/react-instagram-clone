import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import { auth, db } from './firebase/firebase'
import { collection, getDocs, query, orderBy, limit,startAfter  } from "firebase/firestore";
import Post from './components/Post';
import PostUpload from './components/PostUpload';
import Auth from './components/Auth'
import {onAuthStateChanged } from "firebase/auth";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'


const App = () => {

  const IG_LOGO = "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png";
  const [docs, setDocs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [morePost, setMorePost] = useState(true);


  const [statelogin, setStatelogin] = useState(false);
  const [uid , setUid] = useState(null);
  const [user, setUser] = useState(null);
  const [anonymously,setAnonymously] = useState(false);


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {

        //const userAuth = auth.currentUser;
        setUser(authUser);
        setUid(authUser.uid);


      
      } else {
        setUid(null);
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user,uid])

  
  if(user)
  {
    console.log("Username = " + user.displayName);
  }
  console.log("Uidname = " + uid);
  console.log("State = " + statelogin);
  console.log("anonymously = " +anonymously);

  const fetchData = async () => {

    console.log("fetchData");
    // const notesSnapshot = await getDocs(collection(db, "posts"));
    
    // setPosts([...posts, ...notesSnapshot.docs.map(doc => (
    //   {
    //     id: doc.id,
    //     post: doc.data()
    //   }
    // ))])
    
    let q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(3));

    if (posts.length !== 0) {
      const lastVisible = docs[docs.length-1];
      q = query(collection(db, "posts"), orderBy("timestamp", "desc"),startAfter(lastVisible), limit(5));
    }

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs);
    if (querySnapshot.docs.length <= 1) setMorePost(false);
    setDocs([...docs, ...querySnapshot.docs]);
    setPosts([...posts, ...querySnapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()
        }
      ))])
    
      setTimeout(setFetching(false), 1000);

  };

  useEffect(() => {
   
    fetchData();
   
  }, [])

  useEffect(() => {

    console.log("in useeffect fetching = " + fetching);

    if (fetching === false) return;

   

    fetchData();
  }, [fetching])
 

  const checkBottom = (e) => {
    const bottom = (
      (e.target.scrollHeight - Math.ceil(Math.abs(e.target.scrollTop)) === e.target.clientHeight) &
      (fetching === false) &
      (morePost === true))

      //console.log("CheckBottom fetching = "+fetching+ "morepost = " + morePost);
      //console.log(e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight);

      if (bottom) {
       
        setFetching(true)
      }
  }

   //console.log(posts);
 
  // console.log(Array.isArray(posts));
 


  return (
  
    <div className="app" onScroll={checkBottom}>

          

          <Auth openModal={openModal} setOpenModal={setOpenModal} 
          openModalLogin={openModalLogin} setOpenModalLogin={setOpenModalLogin} setStatelogin={setStatelogin} 
          setAnonymously={setAnonymously}/>

          <div className="app__header">
              <img className="app__headerImage" src={IG_LOGO} alt="instagram logo" />
              <div>
                { 
                  user ? 
                  <Button onClick={() => {
                    auth.signOut();
                    setAnonymously(false);
                  }}>Log Out</Button>
                : (
                    <>
                      <Button onClick={() => setOpenModal(true)}>SignUp</Button>
                      <Button onClick={() => setOpenModalLogin(true)}>SignIn</Button>
                    </>
                  )
                }
              </div>
          </div>
          
          <div className="contents">
              {user ? 
                <PostUpload username={user.displayName} uid={user.uid} anonymously={anonymously}/>
              :
              <h4 className="app__notify">
                <Button onClick={() => setOpenModalLogin(true)}>Login to post</Button>
              </h4>
              }
          
          <div className="app__post_view">
            <div className="app__post_wrapper">
          
              {posts.map(({id, post}) => (
            
                
                <Post key={id}
                postID={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageURL={post.imageURL} 
                uid={uid} 
                anonymously={anonymously} 
                />
              

                ))}

            {
              morePost ?
              <div className="app__loading">
                <CircularProgress />
              </div>
              :
              <h5 className="app__bottom">No more post!</h5>
            }
              
            </div>
          </div>
          </div>
    </div>

  );

}

export default App;
