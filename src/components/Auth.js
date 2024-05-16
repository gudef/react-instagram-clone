import React from 'react'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react'
import { auth } from '../firebase/firebase'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile,signInAnonymously } from "firebase/auth"



const Auth = ({openModal, setOpenModal,openModalLogin, setOpenModalLogin, setStatelogin ,setAnonymously}) => {
  
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleClose = () => {
        setOpenModal(false);
      };

    
    const registerUser = () => {
        createUserWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
             // Signed in
             updateProfile(userCredential.user, {displayName : username})  
             
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });

    
        setOpenModal(false);
      } 
      
      

      const loginUser = () => {

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          setStatelogin(true);
          // ...
        })
        .catch((error) => {
          setStatelogin(false);
          const errorCode = error.code;
          const errorMessage = error.message;
        });

        setOpenModalLogin(false);
      }


      const guestButtonPress = () => {
        let randomName = "guest-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

        signInAnonymously(auth)
        .then(() => {
          // Signed in..
          setAnonymously(true);
          setOpenModalLogin(false);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
           // ...
        });

      }


      const handleButtonPress = () => {
        if (openModalLogin) {
            loginUser();
        } else {
            registerUser();
        }
    }

    //console.log(email);
    //console.log(username);
    //console.log(password);
    return (
    <div>

    <Dialog open={openModal || openModalLogin} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
          />
           {openModalLogin ?
                        null
                        :
                <TextField
                autoFocus
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setUsername(e.target.value)}
                />
           }
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>

          <Button onClick={handleButtonPress}>
          {openModalLogin ? 
                "Sign In"
            :
                "Sign Up"
            }
            </Button>

          {openModalLogin ? 
            <Button onClick={guestButtonPress}>
                Log in as Guest
            </Button>
                :
                null
           }
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default Auth