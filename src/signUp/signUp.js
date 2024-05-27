import { auth } from '../firebaseFireStore/config';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import './signUp.css';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpValidation } from '../formValidation/formValidation';
import TextError from '../formValidation/errorMessage';
import { v4 as uuidv4 } from 'uuid';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { eventEmitter } from '../utils/eventEmitter';

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const errorMessages = {
    'auth/invalid-credential': '⚠️Invalid credentials.',
    'auth/user-not-found': '⚠️No user found with this email.',
    'auth/wrong-password': '⚠️Incorrect password.',
    'auth/email-already-in-use': '⚠️Email already in use.',
  };

  const getErrorMessage = (code) => {
    return errorMessages[code] || 'An error occurred. Please try again.';
  };

  const handleSubmit = async (values) => {
    setIsSubmit(true);
    const token = uuidv4();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(auth.currentUser, {
        displayName: values.name,
        token: token,
      });
      console.log("User created with email and password", userCredential.user);
      eventEmitter.dispatch('userSignedUp', values.name);
      navigate("/home");
    } catch (error) {
      setErrorMessage(getErrorMessage(error.code));
      console.error("Error creating user: ", error);
    } finally {
      setIsSubmit(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='formContainer'>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
        }}
        validationSchema={SignUpValidation}
        onSubmit={handleSubmit}>
        <Form className='formWrapper'>
          <h1 style={{ color: '#1976D2' }}>Sign Up</h1>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <Field type="text" name="name" placeholder="Name" className="input" />
          <ErrorMessage name="name" component={TextError} />
          <Field type="text" name="email" placeholder="Email" className="input" />
          <ErrorMessage name="email" component={TextError} />
          <div className="password-field">
            <Field type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="input" />
            <span onClick={togglePasswordVisibility} className="toggle-password-visibility">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>
          <ErrorMessage name="password" component={TextError} />
          <h5>Already have an account? <Link to={"/login"} style={{ color: "#0077b6" }}>Log in here</Link></h5>
          <Button variant='contained' className='btn' type='submit' disabled={isSubmit}>Submit</Button>
        </Form>
      </Formik>
    </div>
  );
};

export default SignUp;
