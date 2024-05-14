import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnI4BZ1e1kb29ufKKkELbOs0R2D3woFVs",
  authDomain: "fir-auth-2e569.firebaseapp.com",
  projectId: "fir-auth-2e569",
  storageBucket: "fir-auth-2e569.appspot.com",
  messagingSenderId: "1046831723079",
  appId: "1:1046831723079:web:af8c507c5a504d1d97b762"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };
