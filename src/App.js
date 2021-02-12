import React, { useState, useRef } from 'react'
import './App.css'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const API_KEY = process.env.REACT_APP_FIREBASE_API

firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: "chat-party-60343.firebaseapp.com",
  projectId: "chat-party-60343",
  storageBucket: "chat-party-60343.appspot.com",
  messagingSenderId: "701818781895",
  appId: "1:701818781895:web:b930924389c7381e357ee2",
  measurementId: "G-1ZJTWFQ7W0"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


const App = () => {

  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export const SignIn = (props) => {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

export const SignOut = (props) => {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export const ChatRoom = () => {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, { idField: 'id' })

  const [formValue, setFormValue] = useState("")

  const sendMessage = async (e) => {
    e.preventDefault()

    const {uid, photoURL} = auth.currentUser
    const tempText  = formValue
    setFormValue('')

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='submit'>💬</button>

      </form>
    </>
  )
}

export const ChatMessage = (props) => {

  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="Profile pic."/>
      <p>{text}</p>
    </div>
  )
}


export default App;


