import React, { useState, useRef } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, dataBase } from '../firebaseFireStore/config';

const EnterPasswordVerification = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '']);
  const user = auth.currentUser;
  const [error, setError] = useState('');
  const pinsCollection = collection(dataBase, "pins");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const pinQuery = query(pinsCollection, where("email", "==", user.email));
      const pinsSnapshot = await getDocs(pinQuery);
      const savedPin = pinsSnapshot.docs[0]?.data()?.pin;

      if (pin.join('') === savedPin) {
        navigate('/home/password');
      } else {
        setError('Invalid pin! Please try again.');
      }
    } catch (error) {
      console.error('Error retrieving pin:', error);
    }
  };

  return (
    <div className='wrapper'>
      <form className="otp-Form" onSubmit={handleSubmit}>
        <span className="mainHeading">Enter 4 Digit Pin</span>
        <div className="inputContainer">
          <input required maxLength="1" type="text" className="otp-input" value={pin[0]} onChange={(e) => handlePinChange(0, e.target.value)} onKeyDown={(e) => handleBackspace(0, e)} ref={inputRefs[0]} />
          <input required maxLength="1" type="text" className="otp-input" value={pin[1]} onChange={(e) => handlePinChange(1, e.target.value)} onKeyDown={(e) => handleBackspace(1, e)} ref={inputRefs[1]} />
          <input required maxLength="1" type="text" className="otp-input" value={pin[2]} onChange={(e) => handlePinChange(2, e.target.value)} onKeyDown={(e) => handleBackspace(2, e)} ref={inputRefs[2]} />
          <input required maxLength="1" type="text" className="otp-input" value={pin[3]} onChange={(e) => handlePinChange(3, e.target.value)} onKeyDown={(e) => handleBackspace(3, e)} ref={inputRefs[3]} />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="verifyButton" type="submit">Submit</button>
        <p className="resendNote">Didn't have a pin? <button className="resendBtn" onClick={() => navigate('/home/create-password-verification')}>Create Pin</button></p>
      </form>
    </div>
  );
}

export default EnterPasswordVerification;
