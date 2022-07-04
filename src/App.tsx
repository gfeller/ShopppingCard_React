import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
/*
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBYzkfzpJ4t1AvyNWZKSwr2vF4laPa9v-8",
    authDomain: "ikaufzetteli.firebaseapp.com",
    databaseURL: "https://ikaufzetteli.firebaseio.com",
    projectId: "ikaufzetteli",
    storageBucket: "ikaufzetteli.appspot.com",
    messagingSenderId: "477279744354",
    appId: "1:477279744354:web:2fff0adf68cbc535bdbc3b"
  };

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
*/
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
