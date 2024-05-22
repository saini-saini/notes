import Layout from "./layout/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Note from "./note/note";
import Password from "./password/password";
import "./App.css";
import SignUp from "./signUp/signUp";
import Login from "./login/login";
import {auth} from "./firebaseFireStore/config";
import { useEffect, useState } from "react";
function App() {
const [userName, setUserName] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user?.displayName);
      }
      else{setUserName("")};
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

          <Route path="/home" element={<Layout userName={userName}/>}>
            <Route index element={<Note />} />
            <Route path="password" element={<Password />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
