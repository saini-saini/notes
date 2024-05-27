import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import '../signUp/signUp.css';
import { Button, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoginValidation } from '../formValidation/formValidation';
import TextError from '../formValidation/errorMessage';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import googleLogo from "../images/google.png";
import { auth, provider, dataBase } from '../firebaseFireStore/config';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const errorMessages = {
    'auth/invalid-credential': '⚠️Invalid credentials.',
    'auth/user-not-found': '⚠️No user found with this email.',
    'auth/wrong-password': '⚠️Incorrect password.',
  };

  const getErrorMessage = (code) => {
    return errorMessages[code] || 'An error occurred. Please try again.';
  };

  const handleSubmit = async (values) => {
    setIsLogin(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      console.log("User signed in with email and password", userCredential.user);
      navigate("/home");
    } catch (error) {
      setErrorMessage(getErrorMessage(error.code));
      console.error("Error signing in: ", error);
    } finally {
      setIsLogin(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    setErrorMessage('');
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      setErrorMessage(getErrorMessage(error.code));
      if (error.code === 'auth/cancelled-popup-request') {
        console.log('Sign-in popup request was cancelled.');
      } else {
        console.error('Error during Google sign-in:', error);
      }
    } finally {
      setIsSigningInWithGoogle(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  return (
    <div className='formContainer'>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={LoginValidation}
        onSubmit={handleSubmit}>
        <Form className='formWrapper'>
          <h1 style={{ color: '#1976D2' }}>Sign In</h1>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <Field type="text" name="email" placeholder="Email" className="input" />
          <ErrorMessage name="email" component={TextError} />
          <div className="password-field">
            <Field type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="input" />
            <span onClick={togglePasswordVisibility} className="toggle-password-visibility">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>
          <ErrorMessage name="password" component={TextError} />
          <h5>Don't have an account? <Link to={"/"} style={{ color: "#0077b6" }}>Sign up here</Link></h5>
          <Button variant='contained' className='btn' type='submit' disabled={isLogin}>Submit</Button>
          <Divider variant='middle' style={{ color: 'black' }}>Or</Divider>
          <Button variant='outlined' onClick={handleGoogleSignIn} disabled={isSigningInWithGoogle}>
            <img src={googleLogo} alt="Google logo" style={{ width: 20, height: 20, marginRight: 10 }} />
            Sign in with Google
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
