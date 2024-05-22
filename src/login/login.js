import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import '../signUp/signUp.css';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoginValidation } from '../formValidation/formValidation';
import TextError from '../formValidation/errorMessage';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { dataBase } from '../firebaseFireStore/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseFireStore/config'

const Login = () => {
  const authData = collection(dataBase, "authData");
  const loginCollection = collection(dataBase, "login");
  const navigate = useNavigate();

  const handleSubmit = async(values) => {
    
    // const docRef = await addDoc(authData, dataWithToken);
    // console.log("Document written with ID: ", docRef.id);
    signInWithEmailAndPassword(auth, values.email, values.password).then((userCredential) => {
      console.log("User created with email and password", userCredential.user);
      navigate("/home");
    }).catch((error) => {
      console.error("Error creating user: ", error);
    })
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
          <Field type="text" name="email" placeholder="Email" className="input" />
          <ErrorMessage name="email" component={TextError} />
          <Field type="password" name="password" placeholder="Password" className="input" />
          <ErrorMessage name="password" component={TextError} />
          <h5>Don't have an account? <Link to={"/"} style={{ color: "#0077b6" }}>Sign up here</Link></h5>
          <Button variant='contained' className='btn' type='submit'>Submit</Button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
