import React from 'react'
import './style.css'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import TextError from '../formValidation/errorMessage';

const PasswordVerification = () => {
    const navigate = useNavigate()

    const handleSubmit = (values) => {
        console.log(values)
        navigate('/home/password')
    }
    return (
        <div className='passwordVerifyContainer'>
            <Formik
                initialValues={{
                    password: '',
                }}
                onSubmit={handleSubmit}>
                <Form className='passwordWrapper'>
                    <p className='title'>Enter password</p>
                    <Field type="text" name="password" placeholder="Enter password" className="input" />
                    <ErrorMessage name="password" component={TextError} />
                    <Button variant='contained' className='submit' type="submit">Submit</Button>
                </Form>

            </Formik>
        </div>
    )
}

export default PasswordVerification