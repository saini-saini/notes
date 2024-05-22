import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import './signUp.css'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { SignUpValidation } from '../formValidation/formValidation'
import TextError from '../formValidation/errorMessage'
import { v4 as uuidv4 } from 'uuid'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebaseFireStore/config'
import { eventEmitter } from '../utils/eventEmitter'
const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = async(values) => {
    const token = uuidv4();
    const dataWithToken = {
      ...values,
      token: token
    };
    // const docRef = await addDoc(authData, dataWithToken);
    // console.log("Document written with ID: ", docRef.id);
    createUserWithEmailAndPassword(auth, values.email, values.password).then((userCredential) => {
      updateProfile(auth.currentUser, {
        displayName: values.name,
        token: token
      })
      console.log("User created with email and password", userCredential.user);
      navigate("/home");
      eventEmitter.dispatch('signup');
    }).catch((error) => {
      console.error("Error creating user: ", error);
    })
    console.log(dataWithToken, "values with token")
  }

  
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
          <Field type="text" name="name" placeholder="Name" className="input" />
          <ErrorMessage name="name" component={TextError} />
          <Field type="text" name="email" placeholder="Email" className="input" />
          <ErrorMessage name="email" component={TextError} />
          <Field type="text" name="password" placeholder="Password" className="input" />
          <ErrorMessage name="password" component={TextError} />
          <h5>Already have an account? <Link to={"/login"} style={{ color: "#0077b6" }}>Log in here</Link></h5>
          <Button variant='contained' className='btn' type='submit'>Submit</Button>
        </Form>
      </Formik>
    </div>
  )
}

export default SignUp
