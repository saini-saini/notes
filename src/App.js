import Layout from "./layout/layout";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Note from "./note/note";
import Password from "./password/password";
import "./App.css";
import SignUp from "./signUp/signUp";
import Login from "./login/login";
import {auth} from "./firebaseFireStore/config";
import { useEffect, useState } from "react";
import PageNotFound from "./pageNoteFound/pageNotFound";

function App() {
const [userName, setUserName] = useState("");

const [isAuthenticated, setIsAuthenticated] = useState(false);
function PrivateRoute({ isAuthenticated }) {
  if (!isAuthenticated) return <Navigate to="/" />;
  return <Outlet />;
}

function PublicRoute({ isAuthenticated }) {
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}

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
        
        <Route element={<PublicRoute isAuthenticated={!!userName} />}  >
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute isAuthenticated={!!userName} />} >
          <Route path="/home" element={<Layout userName={userName}/>}>
            <Route index element={<Note />} />
            <Route path="password" element={<Password />} />
          </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />

        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
