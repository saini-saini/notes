import React, { useState } from 'react';
import './style.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseFireStore/config';
import TextError from '../formValidation/errorMessage';
import { PasswordVerificationSchema } from '../formValidation/formValidation';
const PasswordVerification = () => {
    const navigate = useNavigate();
    const [firebaseError, setFirebaseError] = useState('');

    const initialValues = {
        password: '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const user = auth.currentUser;

        if (user) {
            const credential = EmailAuthProvider.credential(user.email, values.password);
            try {
                await reauthenticateWithCredential(user, credential);
                navigate('/home/password');
            } catch (error) {
                setFirebaseError('Incorrect password. Please try again.');
            }
        } else {
            setFirebaseError('No authenticated user found.');
        }

        setSubmitting(false);
    };

    return (
        <div className='passwordVerifyContainer'>
            <Formik
                initialValues={initialValues}
                validationSchema={PasswordVerificationSchema}
                onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                    <Form className='passwordWrapper'>
                        <p className='title'>Enter password</p>
                        <Field type="text" name="password" placeholder="Enter password" className="input" />
                        <ErrorMessage name="password" component={TextError} />
                        {firebaseError && <div className="error-message">{firebaseError}</div>}
                        <Button
                            variant='contained'
                            className='submit'
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PasswordVerification;
