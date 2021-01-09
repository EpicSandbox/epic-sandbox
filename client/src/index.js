import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

firebase.initializeApp({
    apiKey: "AIzaSyATC7uN2uLATo9W3fF8OO8cOCDbkL0y1dw",
    authDomain: "mafreact.firebaseapp.com",
    projectId: "mafreact",
    storageBucket: "mafreact.appspot.com",
    messagingSenderId: "101506863783",
    appId: "1:101506863783:web:1fe8c070c5512814a58182",
    measurementId: "G-CTG9Q7SV9S"
  });


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
