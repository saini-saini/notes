import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { auth, dataBase } from '../firebaseFireStore/config';
import './style.css';

const PasswordVerification = () => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const pinsCollection = collection(dataBase, "pins");
    const user = auth.currentUser;
    const navigate = useNavigate();
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handlePinChange = (index, value) => {
        if (/^\d+$/.test(value) || value === '') {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);
            if (value !== '' && index < 3) {
                inputRefs[index + 1].current.focus();
            }
        }
    };

    const handleBackspace = (index, e) => {
        if (e.keyCode === 8 && pin[index] === '') {
            e.preventDefault();
            if (index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };

    const handlePinCreation = async () => {
        const pinValue = pin.join('');
        if (pin.includes('')) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const q = query(pinsCollection, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(pinsCollection, {
                    email: user.email,
                    pin: pinValue
                });
            } else {
                const docRef = querySnapshot.docs[0].ref;
                await updateDoc(docRef, {
                    pin: pinValue
                });
            }

            navigate('/home/password');
        } catch (error) {
            console.error('Error storing pin:', error);
        }
    };

    const handleNavigate = (e) => {
        e.preventDefault();
        navigate('/home/password-verification');
    };

    return (
        <div className='wrapper'>
            <form className="otp-Form">
                <span className="mainHeading">Create 4 Digit Pin</span>
                <div className="inputContainer">
                    <input required maxLength="1" type="text" className="otp-input" value={pin[0]} onChange={(e) => handlePinChange(0, e.target.value)} onKeyDown={(e) => handleBackspace(0, e)} ref={inputRefs[0]} />
                    <input required maxLength="1" type="text" className="otp-input" value={pin[1]} onChange={(e) => handlePinChange(1, e.target.value)} onKeyDown={(e) => handleBackspace(1, e)} ref={inputRefs[1]} />
                    <input required maxLength="1" type="text" className="otp-input" value={pin[2]} onChange={(e) => handlePinChange(2, e.target.value)} onKeyDown={(e) => handleBackspace(2, e)} ref={inputRefs[2]} />
                    <input required maxLength="1" type="text" className="otp-input" value={pin[3]} onChange={(e) => handlePinChange(3, e.target.value)} onKeyDown={(e) => handleBackspace(3, e)} ref={inputRefs[3]} />
                </div>
                {error && <p className="error">{error}</p>}
                <button className="verifyButton" type="button" onClick={handlePinCreation}>Create</button>
                <p className="resendNote">Already have a pin? <button type="button" className="resendBtn" onClick={handleNavigate}>Enter Pin</button></p>
            </form>
        </div>
    );
}

export default PasswordVerification;
