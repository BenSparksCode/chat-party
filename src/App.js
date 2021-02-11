import React, { } from 'react'
import './App.css'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const API_KEY = env.process.REACT_APP_FIREBASE_API

firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: "chat-party-60343.firebaseapp.com",
  projectId: "chat-party-60343",
})

const auth


const App = () => {
  return (
    <div className="App">
      <header className="App-header">

      </header>
    </div>
  );
}

export default App;
