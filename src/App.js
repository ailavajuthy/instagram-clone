import React,{ useState, useEffect } from 'react'
import './App.css';
import Post from './Post.js'
import { db, auth } from "./firebase";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import ImageUpload from './ImageUpload'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  padding: '20px',
};
function App() {
const [posts, setPosts]=useState([
]);
const [open, setOpen]=useState(false);
const [openSignIn, setOpenSignIn]=useState(false);
const [username, setUsername]=useState('');
const [password, setPassword]=useState('');
const [email, setEmail]=useState('');
const [user, setUser]=useState(null);

useEffect(()=>{
  const unsubscribe=auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      //user has logged in...
      console.log(authUser);
      setUser(authUser);
    }else{
      //user has logged out...
      setUser(null);
    }
  })
  return ()=>{
    //perform some cleanup
    unsubscribe();
  }
},[user, username])

useEffect(()=>{
  //where code runs
  db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
    setPosts(snapshot.docs.map(doc=>({
      id: doc.id,
      post:doc.data()})))
  }
  )
},[])

  const signUp=(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
      .then(()=>{
        setUser(auth.currentUser);
        setOpen(false);
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false);
  }

  const signIn=(event)=>{
    event.preventDefault();
  
    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="app">

      
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
        <div style={modalStyle}>
          <form className="app__signup">
          <center>
            <img 
            className="app_headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/960px-Instagram_logo.svg.png"
            alt=""
            />
          </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle}>
          <form className="app__signup">
          <center>
            <img 
            className="app_headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/960px-Instagram_logo.svg.png"
            alt=""
            />
          </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>
        </div>
      </Modal>



        <div className="app_header">
          <img 
            className="app_headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/960px-Instagram_logo.svg.png"
            alt=""
          />
          {user?(
          <Button onClick={()=>auth.signOut()}>Log Out</Button>
        ):(
          <div className="app__loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        )
        } 
        </div>
        <div className="app__posts">
          {
            posts.map(({id, post})=>(
              <Post key={id} postId={id} user={user} username={post.username}  caption={post.caption} imageURL={post.imageURL}/>
            ))
          }
        </div>

       
        
        
        {user&&user.displayName?(
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Login to upload</h3>
      )}

        
    </div>
  );
}

export default App;
