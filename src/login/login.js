import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import '../signUp/signUp.css';
import { Button, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoginValidation } from '../formValidation/formValidation';
import TextError from '../formValidation/errorMessage';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import googleLogo from "../images/google.png";
import { auth, provider } from '../firebaseFireStore/config';

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

  const errorMessages = {
    'auth/invalid-credential': '⚠️Invalid credentials.',
    'auth/user-not-found': '⚠️No user found with this email.',
    'auth/wrong-password': '⚠️Incorrect password.',
  };

  const getErrorMessage = (code) => {
    return errorMessages[code] || 'An error occurred. Please try again.';
  };

  const handleSubmit = async(values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      console.log("User signed in with email and password", userCredential.user);
      navigate("/home");
    } catch (error) {
      setErrorMessage(getErrorMessage(error.code));
      console.error("Error signing in: ", error);
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
          <Field type="password" name="password" placeholder="Password" className="input" />
          <ErrorMessage name="password" component={TextError} />
          <h5>Don't have an account? <Link to={"/"} style={{ color: "#0077b6" }}>Sign up here</Link></h5>
          <Button variant='contained' className='btn' type='submit'>Submit</Button>
          <Divider variant='middle' style={{color: 'black'}}>Or</Divider>
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
