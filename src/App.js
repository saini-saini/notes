import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./layout/layout";
import Note from "./note/note";
import Password from "./password/password";
import SignUp from "./signUp/signUp";
import Login from "./login/login";
import PageNotFound from "./pageNoteFound/pageNotFound";
import { auth } from "./firebaseFireStore/config";
import "./App.css";
import Loding from "./loader/loder";
function App() {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
        setIsAuthenticated(true);
      } else {
        setUserName("");
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div><Loding /></div>;
  }

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/home" /> : children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />

          <Route path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Layout userName={userName} />
              </PrivateRoute>
            }
          >
            <Route index element={<Note />} />
            <Route path="password" element={<Password />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
