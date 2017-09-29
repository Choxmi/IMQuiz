import firebase from 'firebase'
// Initialize Firebase
var config = {
  apiKey: "AIzaSyB6ywsEUxZw58MCapcdfOG-OyeduTf_bbY",
  authDomain: "im-quiz.firebaseapp.com",
  databaseURL: "https://im-quiz.firebaseio.com",
  projectId: "im-quiz",
  storageBucket: "im-quiz.appspot.com",
  messagingSenderId: "984431897593"
};
var fire = firebase.initializeApp(config);
export default fire;
